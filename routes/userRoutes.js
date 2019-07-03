const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const catchErrors = require('../middlewares/catchErrors');
const { requireJwtAuth } = require('../middlewares/passportAuth');

router.get('/',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(userController.getUsers)
);

router.get('/:id',
  catchErrors(userController.getUser)
);

router.post('/',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(userController.createUser)
);

router.put('/',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(userController.updateUser)
);

router.delete('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(userController.deleteUser)
);

module.exports = router;
