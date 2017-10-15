const is = require('./is');

module.exports = (table, extractFunction) => {
    const _extractIndex = (code) => {
        switch (typeof code) {
        case 'number':
            return code | 0;
        case 'string':
            const _code = code.charAt();
    
            return (is.aheuiCode(_code))
                ? extractFunction(code.charCodeAt() - '가'.charCodeAt())
                : table.indexOf(code);
        case 'object':
            return _extractIndex(code.toString());
        default:
            return -1;
        }
    };

    return _extractIndex;
};
