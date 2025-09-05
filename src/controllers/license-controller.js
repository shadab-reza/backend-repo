const LicenseService = require('../services/license-service');

class LicenseController {   
    async validateLicense(req, res) {
        let licenseKey = req.body.licenseKey;
        let response = await LicenseService.validateLicense({ licenseKey });
        res.status(200).send({ status: 200, valid: response });
    }
}
const licenseController = new LicenseController();

module.exports = {
    licenseController
}