const Subscription = require('~/models/Subscription');
const { applyTierBalance, getStripe } = require('./Subscription');
const { logger } = require('~/config');

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events for subscription lifecycle.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY — Stripe API key
 *   STRIPE_WEBHOOK_SECRET — Webhook signing secret
 */
async function stripeWebhookHandler(req, res) {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error('[stripeWebhook] STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    logger.error('[stripeWebhook] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  try {
    switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      await handleCheckoutComplete(session);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      await handleSubscriptionUpdated(subscription);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await handleSubscriptionDeleted(subscription);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      await handlePaymentFailed(invoice);
      break;
    }

    default:
      logger.debug(`[stripeWebhook] Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    logger.error(`[stripeWebhook] Error handling ${event.type}:`, error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

/**
 * Handle successful checkout — activate the subscription.
 */
async function handleCheckoutComplete(session) {
  const { userId, tier } = session.metadata || {};
  if (!userId || !tier) {
    logger.warn('[stripeWebhook] checkout.session.completed missing metadata', session.id);
    return;
  }

  await Subscription.findOneAndUpdate(
    { user: userId },
    {
      tier,
      status: 'active',
      stripeSubscriptionId: session.subscription,
      stripeCustomerId: session.customer,
    },
    { upsert: true, new: true },
  );

  await applyTierBalance(userId, tier);
  logger.info(`[stripeWebhook] Activated ${tier} tier for user ${userId}`);
}

/**
 * Handle subscription updates (plan changes, renewals).
 */
async function handleSubscriptionUpdated(stripeSubscription) {
  const sub = await Subscription.findOne({
    stripeSubscriptionId: stripeSubscription.id,
  });

  if (!sub) {
    logger.warn('[stripeWebhook] subscription.updated for unknown subscription', stripeSubscription.id);
    return;
  }

  const statusMap = {
    active: 'active',
    past_due: 'past_due',
    canceled: 'cancelled',
    trialing: 'trialing',
    incomplete: 'incomplete',
  };

  sub.status = statusMap[stripeSubscription.status] || stripeSubscription.status;
  sub.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
  sub.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
  await sub.save();

  logger.info(`[stripeWebhook] Updated subscription ${sub._id} status: ${sub.status}`);
}

/**
 * Handle subscription cancellation — downgrade to free tier.
 */
async function handleSubscriptionDeleted(stripeSubscription) {
  const sub = await Subscription.findOne({
    stripeSubscriptionId: stripeSubscription.id,
  });

  if (!sub) {
    logger.warn('[stripeWebhook] subscription.deleted for unknown subscription', stripeSubscription.id);
    return;
  }

  sub.tier = 'free';
  sub.status = 'cancelled';
  sub.stripeSubscriptionId = undefined;
  sub.currentPeriodStart = undefined;
  sub.currentPeriodEnd = undefined;
  await sub.save();

  await applyTierBalance(sub.user.toString(), 'free');
  logger.info(`[stripeWebhook] Downgraded user ${sub.user} to free tier`);
}

/**
 * Handle failed payment — mark subscription as past_due.
 */
async function handlePaymentFailed(invoice) {
  if (!invoice.subscription) {
    return;
  }

  const sub = await Subscription.findOne({
    stripeSubscriptionId: invoice.subscription,
  });

  if (sub) {
    sub.status = 'past_due';
    await sub.save();
    logger.warn(`[stripeWebhook] Payment failed for user ${sub.user}`);
  }
}

module.exports = { stripeWebhookHandler };
