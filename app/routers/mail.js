import NodeMailer from "nodemailer";

const transport = NodeMailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_LOG,
    pass: process.env.MAIL_PASS,
  },
});

const mailManager = {
  sendMail: async (email, subject, content) => {
    let mailOptions = {
      from: process.env.MAIL_FROM_ADDRESS,
      to: email,
      subject: subject,
      html: content,
    };

    await transport.sendMail(mailOptions);
  },
};

export default mailManager;
