const { character, count } = require('./table')

const arithmetic = (operator) => {
  return (machine, jong) => {
    const { __storage } = machine
    const right = __storage.pop() | 0
    const left = __storage.pop() | 0

    __storage.push(operator(left, right) | 0)
  }
}

const NOTHING = false

module.exports = {
  ㄷ: arithmetic((left, right) => left + right),
  ㅌ: arithmetic((left, right) => left - right),
  ㄸ: arithmetic((left, right) => left * right),
  ㄴ: arithmetic((left, right) => left / right),
  ㄹ: arithmetic((left, right) => left % right),
  ㅇ: (machine, jong) => false,
  ㅎ: (machine, jong) => true,
  ㅃ (machine, jong) {
    machine.__storage.duplicate()

    return NOTHING
  },
  ㅍ (machine, jong) {
    machine.__storage.swap()

    return NOTHING
  },
  ㅅ (machine, jong) {
    machine.__storage.__selectStorage(jong)

    return NOTHING
  },
  ㅆ (machine, jong) {
    machine.__storage.send(machine.getStorage(jong))

    return NOTHING
  },
  ㅊ (machine, jong) {
    if (machine.__storage.pop() !== 0) return NOTHING

    machine.__cursor.reflect()
  },
  ㅈ (machine, jong) {
    const { __storage } = machine
    const right = __storage.pop()
    const left = __storage.pop()

    __storage.push((right <= left) ? 1 : 0)
  },
  ㅁ (machine, jong) {
    const { __storage, output } = machine
    const pop = __storage.pop()

    switch (character.jong[jong]) {
    case 'ㅇ':
      output(pop)
      break
    case 'ㅎ':
      output(String.fromCodePoint(pop))
      break
    }
  },
  ㅂ (machine, jong) {
    const { __storage, input } = machine

    switch (character.jong[jong]) {
    case 'ㅇ':
      __storage.push(input('number'))
      break
    case 'ㅎ':
      __storage.push(input('character'))
      break
    default:
      __storage.push(count.stroke[jong])
      break
    }
  }
}
