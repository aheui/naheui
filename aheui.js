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
var operationMap = (function () {
    function arithmetic (operator) {
        return (function (machine, jong) {
            var storage = machine.storage;
            var right = storage.pop() | 0;
            var left = storage.pop() | 0;
            storage.push((operator(left, right)) | 0);
            return false;
        });
    };
    return {
        'ㅇ': function (machine, jong) {
            return false;
        },
        'ㅎ': function (machine, jong) {
            return true;
        },
        'ㄷ': arithmetic(function (left, right) { return left + right; }),
        'ㄸ': arithmetic(function (left, right) { return left * right; }),
        'ㅌ': arithmetic(function (left, right) { return left - right; }),
        'ㄴ': arithmetic(function (left, right) { return left / right; }),
        'ㄹ': arithmetic(function (left, right) { return left % right; }),
        'ㅁ': function (machine, jong) {
            var output = machine.output;
            var pop = storage.pop();
            switch (jong) {
            case 'ㅇ':
                output(pop.toString());
                break;
            case 'ㅎ':
                output(String.fromCharCode(pop));
                break;
            }
            return false;
        },
        'ㅂ': function (machine, jong) {
            var input = machine.input();
            var push = storage.push;
            switch (jong) {
            case 'ㅇ':
                push(input | 0);
                break;
            case 'ㅎ':
                push(input.charCodeAt() | 0);
                break;
            }
            return false;
        }
    };
})();

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

function Machine(codeSpace) {
    var self = this;
    var storages;
    self.cursor;
    self.storage;
    self.run; var terminateFlag;
    self.step;
    self.input;
    self.output;
    self.selectStorage;
    //
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
    self.cursor = new Cursor(0, 0, 0, 1);
    self.storage = storages[0];
    self.run = function (terminateFunction) {
        terminateFlag = false;
        while (!terminateFlag)
            self.step();
        terminateFunction();
    };
    self.step = function () {
        var code = self.cursor.point(codeSpace);
        var operation = operationMap[code.cho];
        if (typeof operation !== 'undefined')
            terminateFlag = operation(self, code.jong);
        self.cursor.move(code.jung);
    };
    self.selectStorage = function (code) {
        self.storage = storages[jong(code)];
    };
}

function Cursor(x, y, xs, ys) {
    var self = this;
    self.x = (typeof x === 'undefined') ? 0 : x;
    self.y = (typeof y === 'undefined') ? 0 : y;
    self.xs = (typeof xs === 'undefined') ? 0 : xs;
    self.ys = (typeof ys === 'undefined') ? 0 : ys;
    self.point = function (codeSpace) {
        return codeSpace[self.y][self.x];
    };
    self.move = function (jung) {
        switch (self.xs) {
        case 'reflect':
            self.x = -self.x;
            break;
        case undefined:
            break;
        default:
            self.x += self.xs;
            break;
        }
        switch (self.ys) {
        case 'reflect':
            self.y = -self.y;
            break;
        case undefined:
            break;
        default:
            self.y += self.ys;
            break;
        }
    };
}

function Storage(type) { // 'stack', 'queue'
    var self = this;
    var array = [];
    self.push = array.push;
    self.duplicate;
    self.swap;
    switch (type) {
    case 'stack':
        self.pop = array.pop;
        self.duplicate = function () {
            return array.push(array[array.length - 1]);
        };
        self.swap = function () {
            // todo
        };
        break;
    case 'queue':
        self.pop = array.shift;
        self.duplicate = function () {
            // todo
        };
        self.swap = function () {
            // todo
        };
        break;
    case 'pipe':
        // undefined behavior
        self.pop = array.shift;
        self.duplicate = function () {
            // todo
        };
        self.swap = function () {
            // todo
        };
        break;
    default:
        throw 'undefined stoarage type: ' + type;
    }
}
