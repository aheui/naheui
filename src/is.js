const patternHangeul = /^[가-힣]$/;

const testAheui = (code) => patternHangeul.test(code.toString());

module.exports.aheuiCode = (code) => testAheui(code);
module.exports.comment = (code) => !testAheui(code);
