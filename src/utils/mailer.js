const nodemailer = require('nodemailer');
// const { log } = require('./loggerutil');

// Configure the transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shadabreza75@gmail.com',
        pass: 'zpdbzvtvmnhyyipw' // Use App Password if 2FA is enabled
    }
});

// Email options
const mailOptions = {
    from: 'shadabreza75@gmail.com',
    to: 'shadabrezasso@gmail.com',
    subject: 'Test Email',
    text: 'Hello from Node.js using Gmail! witg '
};

const sendMail = (mailOptions = { from: 'shadabreza75@gmail.com', to, subject, text }) => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
}

const sendMailwithAttachement = (mailOptions = { from: 'shadabreza75@gmail.com', to, subject, text }, attachements = [{ filename, path }],cb) => {
mailOptions.attachments = attachements;
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return;
        }
        cb();
        console.log('Email sent: ' + info.response);
    });
}

// sendMail(mailOptions);
// sendMailwithAttachement(mailOptions,[]);

module.exports = {
    sendMail,sendMailwithAttachement
}