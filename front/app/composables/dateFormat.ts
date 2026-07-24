import moment from "moment"

export const useDateFormat = (
  value: string,
  format: string = 'DD-MM-YYYY',
  nullValue: string = ''
) => {
  if (
    value !== '' &&
    value !== null &&
    value !== '0000-00-00 00:00:00'
  ) {
    return moment(value).format(format)
  }

  return nullValue
}
