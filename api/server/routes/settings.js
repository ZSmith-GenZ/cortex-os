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

const router = express.Router();

router.get('/favorites', requireJwtAuth, getFavoritesController);
router.post('/favorites', requireJwtAuth, updateFavoritesController);

router.get('/assistant-profile', requireJwtAuth, getAssistantProfileController);
router.put('/assistant-profile', requireJwtAuth, updateAssistantProfileController);

module.exports = router;
