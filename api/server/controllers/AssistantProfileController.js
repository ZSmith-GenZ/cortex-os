const { updateUser, getUserById } = require('~/models');

const MAX_NAME_LENGTH = 64;
const MAX_PERSONALITY_LENGTH = 2000;

const DEFAULT_PERSONALITY =
  'You are Cortex, a personal AI operating system. You are helpful, direct, and conversational. ' +
  'You remember what the user tells you across conversations and build on that context. ' +
  'You adapt to the user\'s communication style — concise when they\'re brief, detailed when they need depth. ' +
  'You proactively offer relevant suggestions when you notice opportunities to help. ' +
  'You are the user\'s thinking partner, not just a chatbot.';

const DEFAULTS = {
  name: 'Cortex',
  personality: DEFAULT_PERSONALITY,
  avatar: null,
};

const getAssistantProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getUserById(userId, 'assistantProfile');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = user.assistantProfile || DEFAULTS;
    res.status(200).json({
      name: profile.name || DEFAULTS.name,
      personality: profile.personality || DEFAULTS.personality,
      avatar: profile.avatar || DEFAULTS.avatar,
    });
  } catch (error) {
    console.error('Error fetching assistant profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAssistantProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, personality, avatar } = req.body;

    if (name !== undefined && typeof name !== 'string') {
      return res.status(400).json({ message: 'Name must be a string' });
    }

    if (name !== undefined && name.length > MAX_NAME_LENGTH) {
      return res
        .status(400)
        .json({ message: `Name exceeds maximum length of ${MAX_NAME_LENGTH}` });
    }

    if (personality !== undefined && typeof personality !== 'string') {
      return res.status(400).json({ message: 'Personality must be a string' });
    }

    if (personality !== undefined && personality.length > MAX_PERSONALITY_LENGTH) {
      return res
        .status(400)
        .json({ message: `Personality exceeds maximum length of ${MAX_PERSONALITY_LENGTH}` });
    }

    if (avatar !== undefined && avatar !== null && typeof avatar !== 'string') {
      return res.status(400).json({ message: 'Avatar must be a string or null' });
    }

    // Get current profile and merge updates
    const currentUser = await getUserById(userId, 'assistantProfile');
    const currentProfile = currentUser?.assistantProfile || DEFAULTS;

    const updatedProfile = {
      name: name !== undefined ? name : currentProfile.name,
      personality: personality !== undefined ? personality : currentProfile.personality,
      avatar: avatar !== undefined ? avatar : currentProfile.avatar,
    };

    const user = await updateUser(userId, { assistantProfile: updatedProfile });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.assistantProfile);
  } catch (error) {
    console.error('Error updating assistant profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAssistantProfileController,
  updateAssistantProfileController,
};
