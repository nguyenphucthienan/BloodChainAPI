const express = require('express');
const router = express.Router();

const infoController = require('../controllers/infoController');

router.use('/', infoController.getInfo);

module.exports = router;
