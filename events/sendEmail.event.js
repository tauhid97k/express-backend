import { EventEmitter } from 'node:events'
import prisma from '../config/db.config.js'
import mailTransporter from '../config/mail.config.js'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'

// Init Event
const emailEventEmitter = new EventEmitter()

// Email verification on register
emailEventEmitter.on('verificationEmail', async ({ email, code }) => {
  try {
    await prisma.users.update({
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
  } catch (error) {
    console.error(`Failed to send email for ${email}:`, error)
  }
})

// Email verification on password reset
emailEventEmitter.on('passwordResetEmail', async ({ email, code }) => {
  try {
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

    // Send verification email
    await mailTransporter.sendMail({
      from: process.env.Mail_SENDER,
      to: email,
      subject: 'Password reset code',
      text: `Your password reset code is ${code}`,
    })
  } catch (error) {
    console.error(`Failed to send reset email for ${email}:`, error)
  }
})

export default emailEventEmitter
