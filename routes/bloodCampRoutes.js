const express = require('express');
const router = express.Router();

const bloodCampController = require('../controllers/bloodCampController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const photoUpload = require('../middlewares/photoUpload');
const catchErrors = require('../middlewares/catchErrors');
const { requireJwtAuth } = require('../middlewares/passportAuth');

router.get('/',
  catchErrors(bloodCampController.getBloodCamps)
);

router.get('/:id',
  catchErrors(bloodCampController.getBloodCamp)
);

router.post('/',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodCampController.createBloodCamp)
);

router.put('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodCampController.updateBloodCamp)
);

router.delete('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodCampController.deleteBloodCamp)
);

router.get('/:id/staffs',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodCampController.getStaffsOfBloodCamp)
);

router.post('/:id/photos',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  photoUpload,
  catchErrors(bloodCampController.uploadBloodCampPhoto)
);

router.delete('/:id/photos/:photoId',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodCampController.deleteBloodCampPhoto)
);

module.exports = router;
