const express = require('express');
const router = express.Router();

const bloodTestCenterController = require('../controllers/bloodTestCenterController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const photoUpload = require('../middlewares/photoUpload');
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
);

router.post('/:id/photos',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  photoUpload,
  catchErrors(bloodTestCenterController.uploadBloodTestCenterPhoto)
);

router.delete('/:id/photos/:photoId',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodTestCenterController.deleteBloodTestCenterPhoto)
);

module.exports = router;
