const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const catchErrors = require('../middlewares/catchErrors');
const { requireJwtAuth } = require('../middlewares/passportAuth');

router.get('/',
  requireJwtAuth,
  hasRoles([
    RoleNames.ADMIN,
    RoleNames.BLOOD_CAMP,
    RoleNames.BLOOD_TEST_CENTER,
    RoleNames.BLOOD_SEPARATION_CENTER,
    RoleNames.BLOOD_BANK,
    RoleNames.HOSPITAL
  ]),
  catchErrors(userController.getUsers)
);

router.get('/:id',
  catchErrors(userController.getUser)
);

router.post('/',
  requireJwtAuth,
  hasRoles([
    RoleNames.ADMIN,
    RoleNames.BLOOD_CAMP,
    RoleNames.BLOOD_TEST_CENTER,
    RoleNames.BLOOD_SEPARATION_CENTER,
    RoleNames.BLOOD_BANK,
    RoleNames.HOSPITAL
  ]),
  catchErrors(userController.createUser)
);

router.put('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(userController.updateUser)
);

router.delete('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(userController.deleteUser)
);

router.post('/organizations',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(userController.assignOrganization)
);

module.exports = router;
