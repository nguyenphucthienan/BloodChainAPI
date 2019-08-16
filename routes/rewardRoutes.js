const express = require('express');
const router = express.Router();

const rewardController = require('../controllers/rewardController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const photoUpload = require('../middlewares/photoUpload');
const catchErrors = require('../middlewares/catchErrors');
const { requireJwtAuth } = require('../middlewares/passportAuth');

router.get('/',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(rewardController.getRewards)
);

router.get('/public',
  catchErrors(rewardController.getPublicRewards)
);

router.get('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(rewardController.getReward)
);

router.post('/',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(rewardController.createReward)
);

router.put('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(rewardController.updateReward)
);

router.delete('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(rewardController.deleteReward)
);

router.post('/:id/photos',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  photoUpload,
  catchErrors(rewardController.uploadRewardPhoto)
);

router.delete('/:id/photos/:photoId',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(rewardController.deleteRewardPhoto)
);

router.put('/:id/codes',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(rewardController.updateRewardCodes)
);

router.post('/:id/redeem',
  requireJwtAuth,
  catchErrors(rewardController.redeemReward)
);

module.exports = router;
