const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '4ca16acf84e787',
    pass: '3cbf11423236dd'
  }
});

const sendResetEmail = async (email, resetToken) => {
  const frontendUrl = 'http://localhost:3000'; 

  const mailOptions = {
    from: 'noreply@yourapp.com',
    to: email,
    subject: 'Password Reset',
    html: `
      <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
      <p>Please click on the following link, or paste this into your browser to complete the process:</p>
      <p><a href="${frontendUrl}/reset-password?token=${resetToken}">Reset Password</a></p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reset email sent to:', email);
  } catch (error) {
    console.error('Error sending reset email:', error);
  }
};

module.exports = { sendResetEmail };