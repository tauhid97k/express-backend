const yup = require('yup')
const prisma = require('../utils/prisma')

const postValidator = yup.object({
  title: yup
    .string()
    .required('Post title is required')
    .test('unique', 'Post title already exist', async (value) => {
      const post = await prisma.posts.findUnique({
        where: {
          title: value,
        },
      })

      if (post) return false
      else return true
    }),
  slug: yup.string().optional(),
  description: yup.string().required('Description is required'),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['DRAFT', 'PUBLISHED', 'UNPUBLISHED']),
})

module.exports = postValidator
