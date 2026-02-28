const express = require('express');
const {
  updateFavoritesController,
  getFavoritesController,
} = require('~/server/controllers/FavoritesController');
const {
  getAssistantProfileController,
  updateAssistantProfileController,
} = require('~/server/controllers/AssistantProfileController');
const { requireJwtAuth } = require('~/server/middleware');
const { updateUser } = require('~/models');

const router = express.Router();

router.get('/favorites', requireJwtAuth, getFavoritesController);
router.post('/favorites', requireJwtAuth, updateFavoritesController);

router.get('/assistant-profile', requireJwtAuth, getAssistantProfileController);
router.put('/assistant-profile', requireJwtAuth, updateAssistantProfileController);

/** Mark onboarding as complete for the authenticated user */
router.post('/onboarding/complete', requireJwtAuth, async (req, res) => {
  try {
    await updateUser(req.user.id, { onboardingComplete: true });
    res.status(200).json({ message: 'Onboarding complete' });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
