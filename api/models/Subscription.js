const mongoose = require('mongoose');
const { DEFAULT_TIER } = require('~/server/config/tiers');

/**
 * Cortex OS — Subscription Model
 *
 * Tracks each user's subscription tier and Stripe billing state.
 * Kept separate from the core Balance model to avoid modifying upstream schemas.
 */
const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    tier: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: DEFAULT_TIER,
    },
    stripeCustomerId: {
      type: String,
      sparse: true,
    },
    stripeSubscriptionId: {
      type: String,
      sparse: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'past_due', 'trialing', 'incomplete'],
      default: 'active',
    },
    currentPeriodStart: {
      type: Date,
    },
    currentPeriodEnd: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
