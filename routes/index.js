const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send({ name: 'Blood Chain API' });
});

module.exports = router;
