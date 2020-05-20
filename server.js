const express = require('express');
const superagent= require('superagent');
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;
const config = {
    link: 'https://www.hermes.com/au/en/product/rouge-hermes-lip-care-balm-V60001BV000/',
    senderEmail: 'testforbooot@gmail.com',
    receiverEmail1: 'yangluo1105@gmail.com',
    receiverEmail2: 'kanyeishere@gmail.com',
    emailPassword: 'qwe123iop',
    emailHost: 'smtp.gmail.com',
    port: 465
};

let isInStock = false;

app.listen(port,() => console.log('Server is on port '+ port));

schedule.scheduleJob("*/5 * * * * *", function(){
    getInfo().then( );
    console.log('isInStock:' + isInStock);
});


const getInfo = async () => {
    superagent.get(config.link).end((err, res) => {
    if (err) {
        console.log(`Error - ${err}`)
    } else {
        if ( isInStock !== getStockStatus(res) ) {
            isInStock = getStockStatus(res);
            sendEmail();
        }
        isInStock = getStockStatus(res)
    }
});
};

const sendEmail = async () => {
    const transporter = nodemailer.createTransport({
        host:config.emailHost,
        secureConnection: true,
        port:config.port,
        auth: {
            user: config.senderEmail,
            pass: config.emailPassword
        }
    });

    const emailOptions1 = {
        from: 'Yiwei Chen <testforbooot@gmail.com>',
        to: config.receiverEmail1,
        subject:`你的订阅商品状态更新了, inStock: ${isInStock}`,
        text: config.link.toString(),
    };

    const emailOptions2 = {
        from: 'Yiwei Chen <testforbooot@gmail.com>',
        to: config.receiverEmail2,
        subject:`你的订阅商品状态更新了, inStock: ${isInStock}`,
        text: config.link.toString(),
    };

    await transporter.sendMail(emailOptions1);
    await transporter.sendMail(emailOptions2);
    console.log('Email sent')
};

const getStockStatus = (res) => {
    let inStock = false;
    let $ = cheerio.load(res.text);
    let a = $("h-button.add-to-cart-button").attr('disabled');
    if (!a)
        inStock = true;
    return inStock
};

app.get('/', async (req, res) => {
    res.send(isInStock.toString());
});
