const config = require('../config/config') ;
const nodemailer = require('nodemailer');

const sendEmail = async (isInStock) => {
    const transporter = nodemailer.createTransport({
        host: config.Email.emailHost,
        secureConnection: true,
        port: config.Email.port,
        auth: {
            user: config.Email.senderEmail,
            pass: config.Email.emailPassword
        }
    });

    const emailOptions = {
        from: 'Yiwei Chen <kanyeishere@gmail.com>',
        to: config.Email.receiverEmail,
        subject: `你的订阅商品状态更新了, inStock: ${isInStock}`,
        text: '',
    };

    await transporter.sendMail(emailOptions);
};

module.exports = {
    sendEmail
};
