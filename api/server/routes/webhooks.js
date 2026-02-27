const express = require('express');
const router = express.Router();
const { stripeWebhookHandler } = require('../controllers/StripeWebhook');

// Stripe webhooks require raw body for signature verification.
// The raw body middleware is applied in the main app before JSON parsing.
router.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhookHandler);

module.exports = router;
