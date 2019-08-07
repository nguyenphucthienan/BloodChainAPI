const express = require('express');
const router = express.Router();

const campaignController = require('../controllers/campaignController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const checkCampaignPermission = require('../middlewares/checkCampaignPermission');
const photoUpload = require('../middlewares/photoUpload');
const catchErrors = require('../middlewares/catchErrors');
const { requireJwtAuth } = require('../middlewares/passportAuth');

router.get('/',
  catchErrors(campaignController.getCampaigns)
);

router.get('/:id',
  catchErrors(campaignController.getCampaign)
);

router.post('/',
  requireJwtAuth,
  hasRoles([RoleNames.BLOOD_CAMP]),
  catchErrors(campaignController.createCampaign)
);

router.put('/:id',
  requireJwtAuth,
  hasRoles([
    RoleNames.ADMIN,
    RoleNames.BLOOD_CAMP
  ]),
  checkCampaignPermission,
  catchErrors(campaignController.updateCampaign)
);

router.delete('/:id',
  requireJwtAuth,
  hasRoles([
    RoleNames.ADMIN,
    RoleNames.BLOOD_CAMP
  ]),
  checkCampaignPermission,
  catchErrors(campaignController.deleteCampaign)
);

router.post('/:id/photos',
  requireJwtAuth,
  hasRoles([
    RoleNames.ADMIN,
    RoleNames.BLOOD_CAMP
  ]),
  checkCampaignPermission,
  photoUpload,
  catchErrors(campaignController.uploadCampaignPhoto)
);

router.delete('/:id/photos/:photoId',
  requireJwtAuth,
  hasRoles([
    RoleNames.ADMIN,
    RoleNames.BLOOD_CAMP
  ]),
  checkCampaignPermission,
  catchErrors(campaignController.deleteCampaignPhoto)
);

module.exports = router;
