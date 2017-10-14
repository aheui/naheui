const is = require('./is')

module.exports = (table, extractFunction) => {
    const __extractIndex = (code) => {
        switch (typeof code) {
        case 'number':
            return code | 0
        case 'string':
            const __code = code.charAt()
    
            return (is.aheuiCode(__code))
                ? extractFunction(code.charCodeAt() - '가'.charCodeAt())
                : table.indexOf(code)
        case 'object':
            return __extractIndex(code.toString())
        default:
            return -1
        }
    }

    return __extractIndex
}
