const express = require('express');
const router = express.Router();

const bloodProductController = require('../controllers/bloodProductController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const filterBloodProducts = require('../middlewares/filterBloodProducts');
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
  filterBloodProducts,
  catchErrors(bloodProductController.getBloodProducts)
);

router.get('/:id',
  requireJwtAuth,
  hasRoles([
    RoleNames.ADMIN,
    RoleNames.BLOOD_CAMP,
    RoleNames.BLOOD_TEST_CENTER,
    RoleNames.BLOOD_SEPARATION_CENTER,
    RoleNames.BLOOD_BANK,
    RoleNames.HOSPITAL
  ]),
  catchErrors(bloodProductController.getBloodProduct)
);

router.put('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.BLOOD_SEPARATION_CENTER]),
  catchErrors(bloodProductController.updateBloodProduct)
);

router.delete('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.BLOOD_SEPARATION_CENTER]),
  catchErrors(bloodProductController.deleteBloodProduct)
);

router.post('/transfer',
  requireJwtAuth,
  hasRoles([
    RoleNames.BLOOD_SEPARATION_CENTER,
    RoleNames.BLOOD_BANK,
    RoleNames.HOSPITAL
  ]),
  catchErrors(bloodProductController.transferBloodProducts)
);

router.post('/use',
  requireJwtAuth,
  hasRoles([RoleNames.HOSPITAL]),
  catchErrors(bloodProductController.useBloodProducts)
);

module.exports = router;
