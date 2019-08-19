const express = require('express');
const router = express.Router();

const bloodPackController = require('../controllers/bloodPackController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const filterBloodPacks = require('../middlewares/filterBloodPacks');
const checkBloodPackPermission = require('../middlewares/checkBloodPackPermission');
const checkBloodPackBloodCamp = require('../middlewares/checkBloodPackBloodCamp');
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
  filterBloodPacks,
  catchErrors(bloodPackController.getBloodPacks)
);

router.get('/my-blood-packs',
  requireJwtAuth,
  hasRoles([RoleNames.DONOR]),
  catchErrors(bloodPackController.getMyBloodPacks)
);

router.get('/:id',
  requireJwtAuth,
  checkBloodPackPermission,
  catchErrors(bloodPackController.getBloodPack)
);

router.post('/',
  requireJwtAuth,
  hasRoles([RoleNames.BLOOD_CAMP]),
  catchErrors(bloodPackController.createBloodPack)
);

router.put('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.BLOOD_CAMP]),
  checkBloodPackBloodCamp,
  catchErrors(bloodPackController.updateBloodPack)
);

router.delete('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.BLOOD_CAMP]),
  checkBloodPackBloodCamp,
  catchErrors(bloodPackController.deleteBloodPack)
);

router.get('/:id/transfer-histories',
  requireJwtAuth,
  checkBloodPackPermission,
  catchErrors(bloodPackController.getTransferHistories)
);

router.put('/:id/test-results',
  requireJwtAuth,
  hasRoles([RoleNames.BLOOD_TEST_CENTER]),
  catchErrors(bloodPackController.updateTestResults)
);

router.put('/:id/separation-results',
  requireJwtAuth,
  hasRoles([RoleNames.BLOOD_SEPARATION_CENTER]),
  catchErrors(bloodPackController.updateSeparationResults)
);

router.post('/transfer/blood-test-center',
  requireJwtAuth,
  hasRoles([RoleNames.BLOOD_CAMP]),
  catchErrors(bloodPackController.transferBloodPacksToBloodTestCenter)
);

router.post('/transfer/blood-separation-center',
  requireJwtAuth,
  hasRoles([RoleNames.BLOOD_TEST_CENTER]),
  catchErrors(bloodPackController.transferBloodPacksToBloodSeparationCenter)
);

module.exports = router;
