const { Balance } = require('~/db/models');
const Subscription = require('~/models/Subscription');
const { TIERS, DEFAULT_TIER, getTierConfig, isValidTier } = require('~/server/config/tiers');
const { logger } = require('~/config');

/**
 * GET /api/subscription
 * Returns the current user's subscription and tier info.
 */
async function getSubscription(req, res) {
  try {
    const userId = req.user.id;
    let subscription = await Subscription.findOne({ user: userId }).lean();

    if (!subscription) {
      // Create default free subscription for user
      subscription = await Subscription.create({ user: userId, tier: DEFAULT_TIER });
      subscription = subscription.toObject();
    }

    const tierConfig = getTierConfig(subscription.tier);

    res.status(200).json({
      tier: subscription.tier,
      tierName: tierConfig?.name ?? 'Free',
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      credits: tierConfig,
      availableTiers: Object.entries(TIERS).map(([key, config]) => ({
        id: key,
        name: config.name,
        priceMonthly: config.priceMonthly,
        startBalance: config.startBalance,
        refillAmount: config.refillAmount,
        messageRateLimit: config.messageRateLimit,
      })),
    });
  } catch (error) {
    logger.error('[getSubscription]', error);
    res.status(500).json({ error: 'Failed to retrieve subscription' });
  }
}

/**
 * POST /api/subscription/checkout
 * Creates a Stripe Checkout session for upgrading to a paid tier.
 */
async function createCheckoutSession(req, res) {
  try {
    const { tier } = req.body;
    const userId = req.user.id;

    if (!tier || !isValidTier(tier)) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    const tierConfig = getTierConfig(tier);
    if (tierConfig.priceMonthly === 0) {
      return res.status(400).json({ error: 'Cannot checkout for free tier' });
    }

    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({ error: 'Stripe is not configured. Contact the administrator.' });
    }

    // Get or create Stripe customer
    let subscription = await Subscription.findOne({ user: userId });
    if (!subscription) {
      subscription = await Subscription.create({ user: userId, tier: DEFAULT_TIER });
    }

    let customerId = subscription.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: { userId, cortexTier: tier },
      });
      customerId = customer.id;
      subscription.stripeCustomerId = customerId;
      await subscription.save();
    }

    // Map tier to Stripe price ID from env
    const priceId = getPriceIdForTier(tier);
    if (!priceId) {
      return res.status(503).json({ error: `Stripe price not configured for ${tier} tier` });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.DOMAIN_CLIENT || 'http://localhost:3080'}/settings?tab=subscription&success=true`,
      cancel_url: `${process.env.DOMAIN_CLIENT || 'http://localhost:3080'}/settings?tab=subscription&cancelled=true`,
      metadata: { userId, tier },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    logger.error('[createCheckoutSession]', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}

/**
 * POST /api/subscription/portal
 * Creates a Stripe Billing Portal session for managing an existing subscription.
 */
async function createPortalSession(req, res) {
  try {
    const userId = req.user.id;

    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({ error: 'Stripe is not configured' });
    }

    const subscription = await Subscription.findOne({ user: userId });
    if (!subscription?.stripeCustomerId) {
      return res.status(400).json({ error: 'No billing account found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.DOMAIN_CLIENT || 'http://localhost:3080'}/settings?tab=subscription`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    logger.error('[createPortalSession]', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
}

/**
 * Apply tier-specific balance settings when a subscription changes.
 * Called from webhook handler or manual tier change.
 *
 * @param {string} userId - MongoDB user ID
 * @param {string} tierName - Tier to apply ('free', 'pro', 'enterprise')
 */
async function applyTierBalance(userId, tierName) {
  const tierConfig = getTierConfig(tierName);
  if (!tierConfig) {
    throw new Error(`Invalid tier: ${tierName}`);
  }

  // Update the user's balance record with tier-appropriate refill settings
  await Balance.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        autoRefillEnabled: true,
        refillAmount: tierConfig.refillAmount,
        refillIntervalValue: tierConfig.refillIntervalValue,
        refillIntervalUnit: tierConfig.refillIntervalUnit,
      },
    },
    { upsert: true, new: true },
  );

  logger.info(`[applyTierBalance] Applied ${tierName} tier balance for user ${userId}`);
}

/**
 * Get the Stripe SDK instance (lazy-loaded).
 * Returns null if STRIPE_SECRET_KEY is not set.
 */
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  // Lazy require to avoid startup failure when Stripe is not configured
  const Stripe = require('stripe');
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

/**
 * Map tier name to Stripe price ID from environment variables.
 */
function getPriceIdForTier(tier) {
  const map = {
    pro: process.env.STRIPE_PRICE_PRO,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
  };
  return map[tier] || null;
}

module.exports = {
  getSubscription,
  createCheckoutSession,
  createPortalSession,
  applyTierBalance,
  getStripe,
};
