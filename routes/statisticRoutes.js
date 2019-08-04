const express = require('express');
const router = express.Router();

const statisticController = require('../controllers/statisticController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const catchErrors = require('../middlewares/catchErrors');
const { requireJwtAuth } = require('../middlewares/passportAuth');

router.get('/landing',
  catchErrors(statisticController.getLandingStatistics)
);

router.get('/admin',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(statisticController.getAdminStatistics)
);

module.exports = router;
