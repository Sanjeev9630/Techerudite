const express = require('express');
const adminController = require('../controller/adminController')

const router = express.Router();

router.post('/register', adminController.registerAController)
router.post('/login', adminController.loginAController)

module.exports = router ;


