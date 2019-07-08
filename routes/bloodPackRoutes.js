const express = require('express');
const router = express.Router();

const bloodPackController = require('../controllers/bloodPackController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const filterBloodPacks = require('../middlewares/filterBloodPacks');
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

router.get('/:id',
  requireJwtAuth,
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
  catchErrors(bloodPackController.updateBloodPack)
);

router.delete('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.BLOOD_CAMP]),
  catchErrors(bloodPackController.deleteBloodPack)
);

module.exports = router;
