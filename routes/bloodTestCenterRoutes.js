const express = require('express');
const router = express.Router();

const bloodTestCenterController = require('../controllers/bloodTestCenterController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const catchErrors = require('../middlewares/catchErrors');
const { requireJwtAuth } = require('../middlewares/passportAuth');

router.get('/',
  catchErrors(bloodTestCenterController.getBloodTestCenters)
);

router.get('/:id',
  catchErrors(bloodTestCenterController.getBloodTestCenter)
);

router.post('/',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodTestCenterController.createBloodTestCenter)
);

router.put('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodTestCenterController.updateBloodTestCenter)
);

router.delete('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodTestCenterController.deleteBloodTestCenter)
);

router.get('/:id/staffs',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodTestCenterController.getStaffsOfBloodTestCenter)
)

module.exports = router;
