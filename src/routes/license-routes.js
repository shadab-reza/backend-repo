const {licenseController} = require('../controllers/license-controller');
const express = require('express');
const router = express.Router();

router.post('/validate-license', licenseController.validateLicense);

module.exports = {
    licenseRoutes: router
}