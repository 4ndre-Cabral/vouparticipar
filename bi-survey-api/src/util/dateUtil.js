const getDateFromString = function (dateStr) {
  const dateParts = dateStr.split('/')
  return new Date(dateParts[2], dateParts[1] - 1, +dateParts[0])
}

module.exports = {
  getDateFromString
}
