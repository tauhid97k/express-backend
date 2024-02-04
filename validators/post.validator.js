import * as yup from 'yup'
import prisma from '../config/db.config.js'

const postValidator = yup.object({
  title: yup
    .string()
    .required('Post title is required')
    .test('unique', 'Post title already exists', async (value) => {
      const post = await prisma.posts.findUnique({
        where: {
          title: value,
        },
      })

      return !post
    }),
  slug: yup.string().optional(),
  description: yup.string().required('Description is required'),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['DRAFT', 'PUBLISHED', 'UNPUBLISHED']),
})

export default postValidator
