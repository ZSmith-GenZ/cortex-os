const express = require('express');
const router = express.Router();
const { requireJwtAuth } = require('../middleware/');
const {
  getSubscription,
  createCheckoutSession,
  createPortalSession,
} = require('../controllers/Subscription');

// All routes require authentication
router.get('/', requireJwtAuth, getSubscription);
router.post('/checkout', requireJwtAuth, createCheckoutSession);
router.post('/portal', requireJwtAuth, createPortalSession);

module.exports = router;
