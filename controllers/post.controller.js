import prisma from '../config/db.config.js'
import asyncHandler from 'express-async-handler'
import slug from 'slug'
import {
  selectQueries,
  commonFields,
  paginateWithSorting,
} from '../utils/metaData.js'
import {
  postThumbnailValidator,
  postValidator,
} from '../validators/post.validator.js'
import { v4 as uuidV4 } from 'uuid'
import generateFileLink from '../utils/generateFileLink.js'

/*
  @route    GET: /posts
  @access   private
  @desc     Get all posts
*/
const getPosts = asyncHandler(async (req, res, next) => {
  const selectedQueries = selectQueries(req.query, commonFields)
  let { search } = selectedQueries
  const { page, take, skip, orderBy } = paginateWithSorting(selectedQueries)

  search = search ? search : null
  const [posts, total] = await prisma.$transaction([
    prisma.posts.findMany({
      where: search
        ? {
            title: {
              contains: search,
            },
          }
        : {},
      take,
      skip,
      orderBy,
    }),
    prisma.posts.count({
      where: search
        ? {
            title: {
              contains: search,
            },
          }
        : {},
    }),
  ])

  // Generate thumbnail url
  const formatPosts = posts.map((post) => ({
    ...post,
    thumbnail: generateFileLink(`posts/${post.thumbnail}`),
  }))

  return res.json({
    data: formatPosts,
    meta: {
      page,
      limit: take,
      total,
    },
  })
})

/*
  @route    POST: /posts
  @access   private
  @desc     Create a new post
*/
const createPost = asyncHandler(async (req, res, next) => {
  const data = await postValidator.validate(req.body, { abortEarly: false })
  const { thumbnail } = await postThumbnailValidator.validate(req.files, {
    abortEarly: false,
  })

  // Thumbnail
  const uniqueFolder = `post_${uuidV4()}_${new Date() * 1000}`
  const uploadPath = `uploads/posts/${uniqueFolder}/${thumbnail.name}`
  const filePathToSave = `${uniqueFolder}/${thumbnail.name}`

  thumbnail.mv(uploadPath, (error) => {
    if (error)
      return res.status(500).json({
        message: 'Error saving thumbnail',
      })
  })

  // Save file path to database
  data.thumbnail = filePathToSave

  // Slugify post title for slug
  data.slug = slug(data.title)

  await prisma.posts.create({
    data: { ...data, user_id: 1 },
  })

  res.status(201).json({
    message: 'Post is created',
  })
})

/*
  @route    DELETE: /posts/:id
  @access   private
  @desc     Delete a post
*/
const deletePost = asyncHandler(async (req, res, next) => {
  const id = req.params.id

  await prisma.posts.delete({
    where: {
      id: Number(id),
    },
  })

  res.status(201).json({
    message: 'Post is deleted',
  })
})

export { getPosts, createPost, deletePost }
