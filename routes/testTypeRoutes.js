const express = require('express');
const router = express.Router();

const testTypeController = require('../controllers/testTypeController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const catchErrors = require('../middlewares/catchErrors');
const { requireJwtAuth } = require('../middlewares/passportAuth');

router.get('/',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(testTypeController.getTestTypes)
);

router.get('/all',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(testTypeController.getAllTestTypes)
);

router.get('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(testTypeController.getTestType)
);

router.post('/',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(testTypeController.createTestType)
);

router.delete('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(testTypeController.deleteTestType)
);

module.exports = router;
