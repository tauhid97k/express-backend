import dayjs from 'dayjs'

const formatDate = (date) => {
  return dayjs(date).format('DD MMM YYYY')
}

export { formatDate }
