const express = require('express');
const customerController = require('../controller/customerController')

const router = express.Router();

router.post('/register', customerController.registerCController)

module.exports = router ;