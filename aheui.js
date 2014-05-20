var choTable = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
    'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ',
    'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];
var jungTable = [
    'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
    'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
    'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ',
    'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ',
    'ㅣ'
];
var jongTable = [
    '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ',
    'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
    'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ',
    'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ',
    'ㅌ', 'ㅍ', 'ㅎ'
];
var xSpeedTable = [
    // 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
    1, undefined, 2, undefined, -1,
    // 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
    undefined, -2, undefined, 0, undefined,
    // 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ',
    undefined, undefined, 0, 0, undefined,
    // 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ',
    undefined, undefined, 0, 0, 'reflect',
    // 'ㅣ'
    'reflect'
];
var ySpeedTable = [
    // 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
    0, undefined, 0, undefined, 0,
    // 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
    undefined, 0, undefined, -1, undefined,
    // 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ',
    undefined, undefined, -2, 1, undefined,
    // 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ',
    undefined, undefined, 2, 'reflect', 'reflect',
    // 'ㅣ'
    0
];
var strokeCountTable = [
    // null, 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ',
    0, 2, 4, 4, 2,
    // 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
    5, 5, 3, 5, 7,
    // 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ',
    9, 9, 7, 9, 9,
    // 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
    8, 4, 4, 6, 2,
    // 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ',
    4, 1, 3, 4, 3,
    // 'ㅌ', 'ㅍ', 'ㅎ'
    4, 4, 3
];

function isAheuiCode(code) {
    return /^[가-힣]$/.test(code.toString());
}
function isComment(code) {
    return !isAheuiCode(code.toString());
}

function indexExtractor(table, extractFunction) {
    function extractIndex(code) {
        switch (typeof code) {
        case 'number':
            return code | 0;
        case 'string':
            code = code.charAt();
            if (isAheuiCode(code))
                return extractFunction(code.charCodeAt() - '가'.charCodeAt());
            else
                return table.indexOf(code);
            break;
        case 'object':
            return extractIndex(code.toString());
        default:
            return -1;
        }
    }
    return extractIndex;
}
var cho = indexExtractor(choTable, function (syllableCode) {
    return (syllableCode / 588) | 0;
});
var jung = indexExtractor(jungTable, function (syllableCode) {
    return (((syllableCode / 28) | 0) % 21) | 0;
});
var jong = indexExtractor(jongTable, function (syllableCode) {
    return (syllableCode % 28) | 0;
});

function code(char) {
    return {
        char: char,
        cho: cho(char),
        jung: jung(char),
        jong: jong(char),
        toString: function () {
            return this.char;
        }
    }
}

function codeSpace(sourceCode) {
    return sourceCode.split(/\n|\r\n/g).map(function (line) {
        return line.split('').map(function (char) {
            return code(char);
        });
    });
}

function Machine(terminateFunction) {
    var self = this;
    var cursor;
    var storages;
    var storage;
    self.run; var terminateFlag = false;
    self.terminate;
    self.selectStorage;
    //
    cursor = new Cursor(0, 0, 0, 1);
    storages = (function () {
        var storage;
        var storages = [];
        for (var i = 0; i < jongTable.length; ++i) {
            switch (jongTable[i]) {
            case 'ㅇ':
                storage = new Storage('queue');
                break;
            case 'ㅎ':
                storage = new Storage('pipe');
                break;
            default:
                storage = new Storage('stack');
                break;
            }
            storages.push(storage);
        }
        return storages;
    })();
    storage = storages[0];
    self.run = function () {
        // todo
    };
    self.terminate = (typeof terminateFunction === 'undefined')
                     ? function () { terminateFlag = true; }
                     : terminateFunction;
    self.selectStorage = function (jong) {
        // todo
    };
}

function Cursor(x, y, xs, ys) {
    var self = this;
    self.x = (typeof x === 'undefined') ? 0 : x;
    self.y = (typeof y === 'undefined') ? 0 : y;
    self.xs = (typeof xs === 'undefined') ? 0 : xs;
    self.ys = (typeof ys === 'undefined') ? 0 : ys;
}

function Storage(type) { // 'stack', 'queue'
    var self = this;
    var array = [];
    self.push = array.push;
    switch (type) {
    case 'stack':
        self.pop = array.pop;
        break;
    case 'queue':
        self.pop = array.shift;
        break;
    case 'pipe':
        self.pop = array.shift; // undefined behavior
        break;
    default:
        throw 'undefined stoarage type: ' + type;
    }
}
