const yup = require('yup')

const registerValidator = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().required('Email is required').email('Email is invalid'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match'),
})

module.exports = registerValidator
