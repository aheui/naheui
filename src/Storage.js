const array = []

/**
 * 아희 머신이 사용하는 저장공간입니다.
 * 인자로 받는 type에 따라 조금씩 다르게 작동합니다.
 */
class Storage {
  /**
   * 아희 머신이 사용하는 저장공간입니다.
   * 인자로 받는 type에 따라 조금씩 다르게 작동합니다.
   * 
   * @description 'stack': 저장공간이 스택 자료형처럼 동작합니다.
   * @description 'queue': 마찬가지로 큐 자료형처럼 동작합니다.
   * @description 'pipe': 확장기능을 위한 통로로 동작합니다. 특별히 정해진 확장기능은 없습니다. 나희에게 정의를 덮어씌우지 않으면 큐와 똑같이 동작합니다.
   * @param { * } type
   */
  constructor (type) {
    switch (type) {
    case 'stack':
      this.pop = () => array.pop()
      this.duplicate = () => array.push(array[array.length - 1])
      this.swap = () => {
        const right = array.pop()
        const left = array.pop()

        array.push(right)
        array.push(left)
      }
      break
    case 'queue':
    case 'pipe':
      this.pop = () => array.shift()
      this.duplicate = () => array.unshift(array[0])
      this.swap = () => {
        const temp = array[0]
        array[0] = array[1]
        array[1] = temp
      }
      break
    default:
      throw new Error(`undefined storage type: ${ type }`)
    }
  }

  /**
   * 저장공간에 값을 집어넣습니다. 스택이나 큐일 경우엔 값을 넣은 후의 저장공간 길이를 반환합니다.
   * 
   * @param {*} v
   */
  push (v) {
    return array.push(v)
  }

  /**
   * 저장공간에서 하나의 값을 빼옵니다.
   * 
   * @description 스택일 경우엔 나중에 집어넣은 값이 반환됩니다.
   * @description 큐일 경우엔 먼저 집어넣은 값이 반환됩니다.
   */
  pop () {}

  /**
   * 저장공간에서 값을 빼 올 위치에다 그 값을 하나 더 집어넣습니다.
   * 스펙에서는 확장기능 통로일 경우에, 마지막으로 보낸 값을 한 번 더 보내도록 정의되어 있으나 나희에게 정의를 덮어씌우지 않으면 큐와 똑같이 동작합니다.
   * 
   * @description 스택이나 큐일 경우엔 값을 넣은 후의 저장공간 길이를 반환합니다.
   */
  duplicate () {}

  /**
   * 저장공간에서 값을 빼 올 위치에 있는 두 항목의 순서를 뒤집습니다.
   * 확장기능 통로에 대해서는 정해진 것이 없으나 나희에게 정의를 덮어씌우지 않으면 큐와 똑같이 동작합니다.
   */
  swap () {}

  /**
   * 값을 하나 뽑아서(storage.pop) 저장공간 to에 값을 집어넣습니다(storage.push).
   * 
   * @param {*} to
   */
  send (to) {
    to.push(this.pop() | 0)
  }

  /**
   * 저장공간에 남어있는 항목의 갯수를 반환합니다.
   */
  count () {
    return array.length
  }

  /**
   * 저장공간의 현재 상태를 문자열로 반환합니다.
   * format인자로 반환할 형식을 지정할 수 있습니다:
   * 
   * @description 'csv': 저장공간에 들어있는 값들을 반환합니다.
   * @description 'csv reversed': 저장공간에 들어있는 값들을 순서를 뒤집고 반환합니다.
   * @param { string } format 
   */
  dump (format) {
    switch (format) {
    case 'csv reverse':
      return array.concat().reverse().join(',')
    case 'csv':
    default:
      return array.join(',')
    }
  }
}

module.exports = Storage
