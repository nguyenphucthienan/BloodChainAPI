const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const catchErrors = require('../middlewares/catchErrors');
const { requireLocalAuth, requireJwtAuth } = require('../middlewares/passportAuth');

router.post('/register', authController.register);

router.post('/check-username',
  catchErrors(authController.checkUsername));

router.post('/login',
  requireLocalAuth,
  catchErrors(authController.logIn));

router.get('/me',
  requireJwtAuth,
  catchErrors(authController.currentUser));

module.exports = router;
