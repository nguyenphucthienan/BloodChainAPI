const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const photoUpload = require('../middlewares/photoUpload');
const catchErrors = require('../middlewares/catchErrors');
const { requireLocalAuth, requireJwtAuth } = require('../middlewares/passportAuth');

router.post('/register',
  catchErrors(authController.register)
);

router.get('/check-username',
  catchErrors(authController.checkUsername)
);

router.get('/check-email',
  catchErrors(authController.checkEmail)
);

router.post('/login',
  requireLocalAuth,
  catchErrors(authController.logIn)
);

router.get('/me',
  requireJwtAuth,
  catchErrors(authController.currentUser)
);

router.put('/me',
  requireJwtAuth,
  catchErrors(authController.editInfo)
);

router.put('/me/photos',
  requireJwtAuth,
  photoUpload,
  catchErrors(authController.changePhoto)
);

router.put('/me/password',
  requireJwtAuth,
  catchErrors(authController.changePassword)
);

router.get('/me/user-info',
  requireJwtAuth,
  catchErrors(authController.getMyUserInfoOnBlockChain)
);

module.exports = router;
