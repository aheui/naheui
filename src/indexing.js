const extractIndex = require('./extractIndex')
const { cho, jung, jong } = require('./table').character

module.exports.cho = extractIndex(cho, (syllableCode) => {
    return (syllableCode / 588) | 0
})

module.exports.jung = extractIndex(jung, (syllableCode) => {
    return (((syllableCode / 28) | 0) % 21) | 0
})

module.exports.jong = extractIndex(jong, (syllableCode) => {
    return (syllableCode % 28) | 0
})
