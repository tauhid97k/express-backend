// Select only given keys from query string
const selectQueries = (obj, keys) => {
  const finalObj = {}
  // Map and set only defined keys
  keys.forEach((key) => {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key]
    }
  })

  return finalObj
}

// Pagination and sorting functionalities
const paginateWithSorting = (options) => {
  const page = Number(options.page <= 0 ? 1 : options.page || 1)
  const take = Number(options.limit || 20)
  const skip = (page - 1) * take
  const sortBy = options.sortBy || 'id'
  const sortOrder = options.sortOrder || 'desc'

  return {
    page,
    skip,
    take,
    orderBy: {
      [sortBy]: sortOrder,
    },
  }
}

// Pagination and sorting query strings
const commonQueries = ['search', 'page', 'limit', 'sortBy', 'sortOrder']

// Posts queries
const postsQueries = [
  'status',
  'search',
  'page',
  'limit',
  'sortBy',
  'sortOrder',
]

export { selectQueries, paginateWithSorting, commonQueries, postsQueries }
