const mailTransporter = require('../config/emailConfig')
const asyncHandler = require('express-async-handler')

const sendEmailVerifyCode = asyncHandler(
  async (sendEmailTo, verificationCode, tx) => {
    await mailTransporter.sendMail({
      from: 'test@example.com',
      to: sendEmailTo,
      subject: 'Email verification',
      text: `Your email verification code is ${verificationCode}`,
    })

    await tx.users.update({
      where: {
        email: sendEmailTo,
      },
      data: {
        email_verify_code: verificationCode,
      },
    })
  }
)

module.exports = { sendEmailVerifyCode }
