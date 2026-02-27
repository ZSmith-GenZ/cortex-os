/**
 * Cortex OS — Subscription Tier Configuration
 *
 * Defines the credit allowances, refill settings, and rate limits for each tier.
 * Token credits: 1000 credits = $0.001 USD
 *
 * Tier pricing (Stripe-managed):
 *   Free:       $0/month   — 100K credits, 100K/month refill
 *   Pro:        $29.99/mo  — 500K credits, 500K/month refill
 *   Enterprise: $99.99/mo  — 2M credits, 2M/month refill
 */

const TIERS = {
  free: {
    name: 'Free',
    startBalance: 100000,
    refillAmount: 100000,
    refillIntervalValue: 30,
    refillIntervalUnit: 'days',
    messageRateLimit: 20,
    priceMonthly: 0,
  },
  pro: {
    name: 'Pro',
    startBalance: 500000,
    refillAmount: 500000,
    refillIntervalValue: 30,
    refillIntervalUnit: 'days',
    messageRateLimit: 100,
    priceMonthly: 2999, // $29.99 in cents
  },
  enterprise: {
    name: 'Enterprise',
    startBalance: 2000000,
    refillAmount: 2000000,
    refillIntervalValue: 30,
    refillIntervalUnit: 'days',
    messageRateLimit: 500,
    priceMonthly: 9999, // $99.99 in cents
  },
};

const TIER_NAMES = Object.keys(TIERS);
const DEFAULT_TIER = 'free';

/**
 * Get tier configuration by name.
 * @param {string} tierName
 * @returns {object|null}
 */
function getTierConfig(tierName) {
  return TIERS[tierName] || null;
}

/**
 * Check if a tier name is valid.
 * @param {string} tierName
 * @returns {boolean}
 */
function isValidTier(tierName) {
  return TIER_NAMES.includes(tierName);
}

module.exports = {
  TIERS,
  TIER_NAMES,
  DEFAULT_TIER,
  getTierConfig,
  isValidTier,
};
