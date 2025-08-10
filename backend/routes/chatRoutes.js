const express = require('express');
const authenticate = require('../middleware/authenticate');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/create', authenticate(), chatController.createChat);
router.post('/send', authenticate(), chatController.sendMessage);
router.get('/:chatId/messages', authenticate(), chatController.getMessages);
router.get('/', authenticate(), chatController.getChats);
router.get('/global', authenticate(), chatController.getGlobalChat);

module.exports = router;