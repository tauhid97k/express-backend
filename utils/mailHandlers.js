import mailTransporter from '../config/mail.config.js'
import asyncHandler from 'express-async-handler'
import prisma from '../config/db.config.js'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'

const sendEmailVerifyCode = asyncHandler(async (email, code, tx) => {
  // Create email verify token
  await tx.users.update({
    where: {
      email,
    },
    data: {
      verification_tokens: {
        create: {
          code,
          token: uuidv4(),
          verify_type: 'EMAIL',
          expires_at: dayjs().add(1, 'day'),
        },
      },
    },
  })

  // Send verification email
  await mailTransporter.sendMail({
    from: process.env.Mail_SENDER,
    to: email,
    subject: 'Email verification',
    text: `Your email verification code is ${code}`,
  })
})

const sendPasswordResetCode = asyncHandler(async (email, code) => {
  // Create password reset token
  await prisma.users.update({
    where: {
      email,
    },
    data: {
      verification_tokens: {
        create: {
          code,
          token: uuidv4(),
          verify_type: 'PASSWORD_RESET',
          expires_at: dayjs().add(1, 'day'),
        },
      },
    },
  })

  // Send password reset code email
  await mailTransporter.sendMail({
    from: process.env.Mail_SENDER,
    to: email,
    subject: 'Password reset code',
    text: `Your password reset code is ${code}`,
  })
})

export { sendEmailVerifyCode, sendPasswordResetCode }
