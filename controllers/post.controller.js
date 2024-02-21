import prisma from '../config/db.config.js'
import asyncHandler from 'express-async-handler'
import slug from 'slug'
import { v4 as uuidV4 } from 'uuid'
import generateFileLink from '../utils/generateFileLink.js'
import fs from 'node:fs/promises'
import {
  selectQueries,
  commonFields,
  paginateWithSorting,
} from '../utils/metaData.js'
import {
  postThumbnailValidator,
  postValidator,
} from '../validators/post.validator.js'

/*
  @route    GET: /posts
  @access   private
  @desc     Get all posts
*/
const getPosts = asyncHandler(async (req, res, next) => {
  const selectedQueries = selectQueries(req.query, commonFields)
  const { page, take, skip, orderBy } = paginateWithSorting(selectedQueries)

  let { search } = selectedQueries
  search = search ? search : null

  const [posts, total] = await prisma.$transaction([
    prisma.posts.findMany({
      where: {
        AND: [
          { status: 'PUBLISHED' },
          search
            ? {
                title: {
                  contains: search,
                },
              }
            : {},
        ],
      },
      take,
      skip,
      orderBy,
    }),
    prisma.posts.count({
      where: {
        AND: [
          { status: 'PUBLISHED' },
          search
            ? {
                title: {
                  contains: search,
                },
              }
            : {},
        ],
      },
    }),
  ])

  // Generate thumbnail url
  const formatPosts = posts.map((post) => ({
    ...post,
    thumbnail: generateFileLink(`posts/${post.thumbnail}`),
  }))

  res.json({
    data: formatPosts,
    meta: {
      page,
      limit: take,
      total,
    },
  })
})

/*
  @route    GET: /posts/:slug
  @access   private
  @desc     Get post details
*/
const getPost = asyncHandler(async (req, res, next) => {
  const slug = req.params.slug

  const findPost = await prisma.posts.findFirst({
    where: {
      slug,
    },
  })

  if (!findPost) {
    return res.status(404).json({
      message: 'No post found',
    })
  }

  findPost.thumbnail = generateFileLink(`posts/${post.thumbnail}`)

  res.json(findPost)
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
  @route    PUT: /posts/:slug
  @access   private
  @desc     Update a post
*/
const updatePost = asyncHandler(async (req, res, next) => {
  const slug = req.params.slug
  const userId = req.user.id

  const data = await postValidator.validate(req.body, { abortEarly: false })
  const { thumbnail } = await postThumbnailValidator.validate(req.files, {
    abortEarly: false,
  })

  await prisma.$transaction(async (tx) => {
    // Find the post
    const findPost = await tx.posts.findFirst({
      where: {
        slug,
      },
    })

    if (!findPost) {
      return res.status(404).json({
        message: 'No post found',
      })
    }

    // Check authorization
    if (findPost.user_id !== userId) {
      return res.status(403).json({
        message: 'You are not authorized to modify the post',
      })
    }

    // Delete Previous Thumbnail
    try {
      const thumbnailDir = `uploads/posts/${findPost.thumbnail.split('/')[0]}`
      await fs.rm(thumbnailDir, { recursive: true })
    } catch (error) {
      return res.json({
        message: 'Error deleting previous thumbnail',
      })
    }

    // Add New thumbnail
    const uniqueFolder = `post_${uuidV4()}_${new Date() * 1000}`
    const uploadPath = `uploads/posts/${uniqueFolder}/${thumbnail.name}`
    const filePathToSave = `${uniqueFolder}/${thumbnail.name}`

    thumbnail.mv(uploadPath, (error) => {
      if (error)
        return res.status(500).json({
          message: 'Error saving thumbnail',
        })
    })

    // Add generated file path
    data.thumbnail = filePathToSave

    // Save to database
    await tx.posts.update({
      where: {
        slug,
      },
      data: { ...data, user_id: userId },
    })

    res.json({ message: 'Post updated successfully' })
  })
})

/*
  @route    DELETE: /posts/:slug
  @access   private
  @desc     Delete a post
*/
const deletePost = asyncHandler(async (req, res, next) => {
  const slug = req.params.slug

  await prisma.$transaction(async (tx) => {
    // Find Post
    const findPost = await tx.posts.findFirst({
      where: {
        slug,
      },
    })

    if (!findPost) {
      return res.status(404).json({
        message: 'No post found',
      })
    }

    // Delete Thumbnail
    try {
      const thumbnailDir = `uploads/posts/${findPost.thumbnail.split('/')[0]}`
      await fs.rm(thumbnailDir, { recursive: true })
    } catch (error) {
      return res.json({
        message: 'Error deleting thumbnail',
      })
    }

    await tx.posts.delete({
      where: {
        slug,
      },
    })

    res.json({
      message: 'Post deleted successfully',
    })
  })
})

export { getPosts, getPost, createPost, updatePost, deletePost }
