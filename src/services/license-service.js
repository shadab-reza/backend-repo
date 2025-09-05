const { mapconfigs } = require('../config/DBConfig');

class LicenseService {

    validateLicense({ licenseKey }) {
        const appId = licenseKey.replace(/"/g, '');
        return mapconfigs.has(appId);
    }
}

module.exports = new LicenseService();