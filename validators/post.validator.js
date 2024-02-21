import * as yup from 'yup'
import prisma from '../config/db.config.js'

const postValidator = yup.object({
  title: yup
    .string()
    .required('Post title is required')
    .test('unique', 'Post title already exists', async (value) => {
      const postTitle = await prisma.posts.findUnique({
        where: {
          title: value,
        },
      })

      return postTitle ? false : true
    }),
  slug: yup.string().required('Slug is required'),
  summary: yup.string().required('Summary is required'),
  description: yup.string().required('Description is required'),
  thumbnail: yup.string().optional(),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
})

const postThumbnailValidator = yup
  .object({
    thumbnail: yup
      .mixed()
      .test(
        'type',
        'Invalid file type. Only JPG, JPEG, and PNG are allowed',
        (file) => {
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
          return allowedTypes.includes(file.mimetype)
        }
      )
      .test('size', 'File size is too large; max 2mb is allowed', (file) => {
        const maxSize = 2 * 1024 * 1024
        return file.size <= maxSize
      }),
  })
  .required('Thumbnail is required')

export { postValidator, postThumbnailValidator }
