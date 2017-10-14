const { character, count } = require('./table')

const arithmetic = (operator) => {
  return (machine, jong) => {
    const { storage } = machine
    const right = storage.pop() | 0
    const left = storage.pop() | 0

    storage.push(operator(left, right) | 0)
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
    machine.storage.duplicate()

    return NOTHING
  },
  ㅍ (machine, jong) {
    machine.storage.swap()

    return NOTHING
  },
  ㅅ (machine, jong) {
    machine.storage.selectStorage(jong)

    return NOTHING
  },
  ㅆ (machine, jong) {
    machine.storage.send(machine.getStorage(jong))

    return NOTHING
  },
  ㅊ (machine, jong) {
    if (machine.storage.pop() !== 0) return NOTHING

    machine.cursor.reflect()
  },
  ㅈ (machine, jong) {
    const { storage } = machine
    const right = storage.pop()
    const left = storage.pop()

    storage.push((right <= left) ? 1 : 0)
  },
  ㅁ (machine, jong) {
    const { storage, output } = machine
    const pop = storage.pop()

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
    const { storage, input } = machine

    switch (character.jong[jong]) {
    case 'ㅇ':
      storage.push(input('number'))
      break
    case 'ㅎ':
      storage.push(input('character'))
      break
    default:
      storage.push(count.stroke[jong])
      break
    }
  }
}
