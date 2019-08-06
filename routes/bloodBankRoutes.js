const express = require('express');
const router = express.Router();

const bloodBankController = require('../controllers/bloodBankController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const photoUpload = require('../middlewares/photoUpload');
const catchErrors = require('../middlewares/catchErrors');
const { requireJwtAuth } = require('../middlewares/passportAuth');

router.get('/',
  catchErrors(bloodBankController.getBloodBanks)
);

router.get('/:id',
  catchErrors(bloodBankController.getBloodBank)
);

router.post('/',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodBankController.createBloodBank)
);

router.put('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodBankController.updateBloodBank)
);

router.delete('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodBankController.deleteBloodBank)
);

router.get('/:id/staffs',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodBankController.getStaffsOfBloodBank)
);

router.post('/:id/photos',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  photoUpload,
  catchErrors(bloodBankController.uploadBloodBankPhoto)
);

router.delete('/:id/photos/:photoId',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodBankController.deleteBloodBankPhoto)
);

module.exports = router;
