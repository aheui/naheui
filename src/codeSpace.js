const is = require('./is')
const indexing = require('./indexing')

module.exports.code = code
function code (char) {
  const result = {
    char,
    toString: () => char
  }

  if (is.aheuiCode(char)) {
    result['cho'] = indexing.cho(char)
    result['jung'] = indexing.jung(char)
    result['jong'] = indexing.jong(char)
  } else {
    result['cho'] = -1
    result['jung'] = -1
    result['jong'] = -1
  }

  return result
}

const newLine = /\r?\n/g

module.exports = (sourceCode) => sourceCode
  .split(newLine)
  .map((line) => line
    .split('')
    .map((char) => code(char))
  )
