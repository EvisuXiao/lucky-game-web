import moment from 'moment'

export function parseDate(date = undefined) {
  return moment(date).format('YYYY-MM-DD')
}

export function parseTime(time = undefined) {
  return moment(time || undefined).format('YYYY-MM-DD HH:mm:ss')
}
