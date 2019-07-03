const express = require('express');
const router = express.Router();

const infoController = require('../controllers/infoController');
const catchErrors = require('../middlewares/catchErrors');

router.use('/',
  catchErrors(infoController.getInfo)
);

module.exports = router;
