const fs = require('fs');
const path = require('path');
const { sendMailwithAttachement } = require('./mailer');
const cron = require('node-cron');
const dirPath = './logs/';


//  Directory to store log files
const logDir = path.join(__dirname, '../../logs');

//  Ensure log directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

//  Function to get today's date as YYYY-MM-DD
function getCurrentDateString() {
    const now = new Date();
    return now.toISOString().slice(0, 10); // e.g. '2025-09-02'
}

function appendAndClose(filePath, data, callback) {
    fs.open(filePath, 'a', (err, fd) => {
        if (err) return callback(err);

        fs.write(fd, data, (err) => {
            if (err) {
                // Close fd before returning error
                return fs.close(fd, () => callback(err));
            }

            // Close fd after write finishes
            fs.close(fd, (errClose) => {
                if (errClose) return callback(errClose);
                callback(null); // success
            });
        });
    });
}

var success = 1, fail = 1;

//  Function to write log message to today's log file
function log(message) {

    const dateStr = getCurrentDateString();
    const logFile = path.join(logDir, `${dateStr}_APP.log`);
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    try {
        appendAndClose(logFile, logMessage, (err) => {
            if (err) {
                console.error(' Error:', err);
            }
        });

        // fs.appendFile(logFile, logMessage, (err) => {
        //     if (err) {  
        //         console.error('Error writing log:', err);
        //     }
        // });

    } catch (error) {
        console.log(error.message);
    }
}

function logrequest(message, appId = '') {

    const dateStr = getCurrentDateString();
    const logFile = path.join(logDir, `${dateStr}_req${appId}.log`);
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    try {

        appendAndClose(logFile, logMessage, (err) => {
            if (err) {
                fail++;
                console.info('success:', success);
                console.info('fail:', fail);
                console.error('Fail to log, error:', err);
            }
            else {
                success++;
                // console.log('success logged.');
            }
        });

        // fs.appendFile(logFile, logMessage, (err) => {
        //     if (err) {  
        //         console.error('Error writing log:', err);
        //     }
        // });

    } catch (error) {
        console.log(error.message);
    }
}


function getPrevDateString() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate()-1);
    return yesterday.toISOString().slice(0, 10); // e.g. '2025-09-02'
}



function uploadAndRemoveLogs() {

    const dateStr = getPrevDateString();

    const files = fs.readdirSync(dirPath).filter(file => {
        const fullPath = path.join(dirPath, file);
        return fs.statSync(fullPath).isFile() && file.startsWith(dateStr);
    });

    const mailOptions = {
        to: 'shadabreza75@gmail.com',
        subject: 'log files of ' + dateStr,
        text: 'log files attached',
    };

    const attachements = [];
    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        // const fileContent = fs.readFileSync(fullPath, 'utf8');
        const fileName = path.basename(fullPath);
        attachements.push({ filename: fileName, path: fullPath });
    });

    sendMailwithAttachement(mailOptions, attachements, () => {
        attachements.forEach((file) => {
            log(file.filename + ' log file sent to ' + mailOptions.to);
            fs.unlinkSync(file.path);
            log(`Deleted: ${file.path}`);
        });

    });

}


// uploadAndRemoveLogs();


cron.schedule('0 1 * * *', () => {
    uploadAndRemoveLogs();
});



module.exports = { log, logrequest }