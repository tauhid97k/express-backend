import * as yup from 'yup'
import prisma from '../config/db.config.js'

const loginValidator = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Email is invalid')
    .test('exist', 'Email does not exist', async (value) => {
      const email = await prisma.users.findUnique({
        where: {
          email: value,
        },
      })

      return email ? true : false
    }),
  password: yup.string().required('Password is required'),
})

export default loginValidator
