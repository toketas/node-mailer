const express = require('express');
const nodemailer = require('nodemailer');

const routes = express.Router();

function health(req, res) {
  return res.send('OK');
};

function validate_payload(payload) {
  const {
    to,
    from,
    cc,
    cco,
    subject,
    html,
  } = payload;

  console.info(to, from, cc, cco, subject);
  let errors = [];

  if (!to || !to.includes('@')) {
    errors.push('Destination invalid');
  }

  if (!from || !from.includes('@')) {
    errors.push('Sender invalid');
  }

  return {
    errors,
  }
};

async function send_email(payload) {
  const {
    to,
    from,
    cc,
    cco,
    subject,
    html,
  } = payload;

  const message = {
    from,
    to,
    subject,
    html,
  };

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    console.info('Sending email...');
    const info = await transport.sendMail(message);
    return { error: [] };
  } catch (err) {
    console.error(err);
    return {
      error: ['Could not send e-mail']
    };
  }
}

async function send(req, res) {
  const payload = req.body;

  const { errors } = validate_payload(payload);
  if (errors.length) {
    return res.status(500).send({
      error: errors,
    });
  }

  const { error } = await send_email(payload);
  if (error.length) {
    return res.status(501).send({
      error,
    })
  }
  return res.status(200).send({ msg: 'E-mail sent.' });
};

routes.get('/health', health);
routes.post('/send', send);

module.exports = routes;
