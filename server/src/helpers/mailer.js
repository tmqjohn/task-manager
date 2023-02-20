const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

async function initMail(username, code, email) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://taskmanager.com",
    },
  });

  let message = {
    body: {
      name: username,
      intro: [
        "You have received this email because a password reset request for your account was received. Please see code below:",
        `<h1>${code}</h1>`,
      ],
      outro:
        "If you did not request a password reset, no further action is required on your part.",
    },
  };

  var emailBody = await mailGenerator.generate(message);

  await transporter.sendMail({
    from: process.env.MAILER_EMAIL,
    to: email,
    subject: "Password Recovery Code",
    html: emailBody,
  });
}

module.exports = initMail;
