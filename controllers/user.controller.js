import asyncHandler from 'express-async-handler'

/*
  @route    GET: /user
  @access   private
  @desc     Auth user
*/
const getUser = asyncHandler(async (req, res, next) => {
  const user = req.user
  res.json(user)
})

export { getUser }
