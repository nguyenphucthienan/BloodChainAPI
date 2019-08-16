const express = require('express');
const router = express.Router();

const blockchainController = require('../controllers/blockchainController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const catchErrors = require('../middlewares/catchErrors');
const { requireJwtAuth } = require('../middlewares/passportAuth');

router.get('/',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(blockchainController.getInfo)
);

router.get('/balance',
  catchErrors(blockchainController.getBalance)
);

router.post('/fund',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(blockchainController.fund)
);

router.post('/transfer',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(blockchainController.transfer)
);

module.exports = router;
