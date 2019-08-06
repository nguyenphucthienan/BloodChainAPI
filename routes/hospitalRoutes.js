const express = require('express');
const router = express.Router();

const hospitalController = require('../controllers/hospitalController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const photoUpload = require('../middlewares/photoUpload');
const catchErrors = require('../middlewares/catchErrors');
const { requireJwtAuth } = require('../middlewares/passportAuth');

router.get('/',
  catchErrors(hospitalController.getHospitals)
);

router.get('/:id',
  catchErrors(hospitalController.getHospital)
);

router.post('/',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(hospitalController.createHospital)
);

router.put('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(hospitalController.updateHospital)
);

router.delete('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(hospitalController.deleteHospital)
);

router.get('/:id/staffs',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(hospitalController.getStaffsOfHospital)
);

router.post('/:id/photos',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  photoUpload,
  catchErrors(hospitalController.uploadHospitalPhoto)
);

router.delete('/:id/photos/:photoId',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(hospitalController.deleteHospitalPhoto)
);

module.exports = router;
