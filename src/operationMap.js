const { character, count } = require('./table');

const arithmetic = (operator) => {
    return (machine, jong) => {
        const { _storage } = machine;
        const right = _storage.pop() | 0;
        const left = _storage.pop() | 0;

        _storage.push(operator(left, right) | 0);
    };
};

const NOTHING = false;

module.exports = {
    ㄷ: arithmetic((left, right) => left + right),
    ㅌ: arithmetic((left, right) => left - right),
    ㄸ: arithmetic((left, right) => left * right),
    ㄴ: arithmetic((left, right) => left / right),
    ㄹ: arithmetic((left, right) => left % right),
    ㅇ: (machine, jong) => false,
    ㅎ: (machine, jong) => true,
    ㅃ(machine, jong) {
        machine._storage.duplicate();

        return NOTHING;
    },
    ㅍ(machine, jong) {
        machine._storage.swap();

        return NOTHING;
    },
    ㅅ(machine, jong) {
        machine._storage._selectStorage(jong);

        return NOTHING;
    },
    ㅆ(machine, jong) {
        machine._storage.send(machine.getStorage(jong));

        return NOTHING;
    },
    ㅊ(machine, jong) {
        if (machine._storage.pop() !== 0) return NOTHING;

        machine._cursor.reflect();
    },
    ㅈ(machine, jong) {
        const { _storage } = machine;
        const right = _storage.pop();
        const left = _storage.pop();

        _storage.push((right <= left) ? 1 : 0);
    },
    ㅁ(machine, jong) {
        const { _storage, output } = machine;
        const pop = _storage.pop();

        switch (character.jong[jong]) {
        case 'ㅇ':
            output(pop);
            break;
        case 'ㅎ':
            output(String.fromCodePoint(pop));
            break;
        }
    },
    ㅂ(machine, jong) {
        const { _storage, input } = machine;

        switch (character.jong[jong]) {
        case 'ㅇ':
            _storage.push(input('number'));
            break;
        case 'ㅎ':
            _storage.push(input('character'));
            break;
        default:
            _storage.push(count.stroke[jong]);
            break;
        }
    },
};
