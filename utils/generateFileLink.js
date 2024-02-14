const generateFileLink = (filePath) => {
  const domain = process.env.DOMAIN || 'http://localhost:11000'

  // Construct the full file URL
  return `${domain}/uploads/${filePath}`
}

export default generateFileLink
