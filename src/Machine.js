const { character, count } = require('./table')
const operationMap = require('./operationMap')
const indexing = require('./indexing')
const Storage = require('./Storage')
const Cursor = require('./Cursor')

const store = []

for (const jong of character.jong) {
    switch (jong) {
    case 'ㅇ':
        store.push(new Storage('queue'))
        break
    case 'ㅎ':
        store.push(new Storage('pipe'))
        break
    default:
        store.push(new Storage('stack'))
    }
}

/**
 * 아희 코드를 해석해서 실행시키는 상태머신입니다.
 */
module.exports = class Machine {
    /**
     * 아희 코드를 해석해서 실행시키는 상태머신입니다.
     * 
     * @param { object } codeSpace
     */
    constructor (codeSpace) {
        this.codeSpace = codeSpace
        this.__terminated = false

        this.__cursor = new Cursor(0, 0, 0, 1)

        this.__selectedStorage = 0
        this.__storage = store[this.__selectedStorage]
    }

    /**
     * 실행할 아희 코드의 위치를 가리키는 객체입니다.
     */
    get cursor () {
        return this.__cursor
    }

    /**
     * 아희 프로그램이 종료되었는지 여부를 나타내는 값입니다.
     */
    get terminated () {
        return this.__terminated
    }

    /**
     * 현재 설정된 저장소입니다. 스택이나 큐, 혹은 확장기능을 위한 통로일 수 있습니다.
     */
    get storage () {
        return this.__storage
    }

    /**
     * 아희 프로그램을 실행시킵니다.
     * 
     * @param { function } terminateFunction 실행이 종료되었을 때 실행됩니다.
     */
    run (terminateFunction) {
        while (!this.__terminated) {
            this.step()
        }

        if (!!terminateFunction) {
            const result = this.__storage.pop() | 0

            terminateFunction(result)
        }
    }

    /**
     * 아희 코드를 한 단계만 실행합니다.
     */
    step () {
        const code = this.__cursor.point(this.codeSpace)

        if (!!code) {
            // cursor turn result
            this.__cursor.turn(code.jung)
            const operation = operationMap[character.cho[code.cho]]

            if (!!operation) {
                if (this.__storage.count() < count.parameter[code.cho]) {
                    // cursor reflect result
                    this.__cursor.reflect()
                } else {
                    this.__terminated = operation(this, code.jong)
                }
            }
        }

        if (!this.__terminated) {
            // cursor move result
            this.__cursor.move(this.codeSpace)
        }
    }

    /**
     * 입력을 요청하는 ㅂ 명령이 실행될 때 호출되는 함수입니다.
     * type으로 'number'나 'character'가 들어올 수 있습니다.
     * machine.input은 요청 타입에 따라 적절한 값을 반환해주면 됩니다.
     * 'number' 타입으로는 정수를, 'character' 타입으로는 길이 하나짜리 문자열을 반환하는 것이 적절합니다.
     */
    input () {
        return ''
    }

    /**
     * 출력을 요쳥하는 ㅁ 명령이 실행될 때 호출될 함수입니다.
     * value로는 보통 숫자 또는 문자가 들어오지만 machine.storage에 들어있는 값에 따라서 다른 타입의 값이 들어갈 수도 있습니다.
     */
    output (value) {
        console.log(value)
    }

    /**
     * 아희 종성 코드를 인자로 받아서 해당하는 Aheui.Storage 인스턴스를 반환합니다.
     * 
     * @param {*} code
     */
    getStorage (code) {
        return this.__storage[indexing.jong(code)]
    }

    /**
     * 아희 종성 코드를 인자로 받아서 해당하는 Aheui.Storage 인스턴스를 machine.stoarge에 대입합니다.
     * 
     * @param {*} code
     */
    selectStorage (code) {
        this.__selectedStorage = indexing.jong(code)
        this.__storage = this.getStorage(this.__selectedStorage)
    }

    /**
     * 아희 머신의 현재 상태를 문자열로 반환합니다.
     * 
     * @description 'classic', 'classic korean', 'jsaheui', 'jsaheui korean': 아희 레퍼런스 구현체인 jsaheui의 한국어 디버깅 덤프와 같은 형식으로 반환합니다.
     * @description 'classic english', 'jsaheui english': 아희 레퍼런스 구현체인 jsaheui의 영어 디버깅 덤프와 같은 형식으로 반환합니다.
     * @param {*} format 반환할 형식을 지정할 수 있습니다.
     */
    dump (format) {
        // capture for classicStyleDump
        const {
            __cursor,
            __storage,
            codeSpace
        } = this

        switch (format) {
        case 'classic english':
        case 'jsaheui english':
            return classicStyleDump('en')
        case 'classic':
        case 'classic korean':
        case 'jsaheui':
        case 'jsaheui koren':
        default:
            return classicStyleDump('ko')
        }

        function classicStyleDump (lang) {
            const code = __cursor.point(codeSpace)

            let coorMsg
            let charMsg

            switch (lang) {
            case 'en':
                coorMsg = 'Coord'
                charMsg = 'Char'
                break
            case 'ko':
            default:
                coorMsg = '위치'
                charMsg = '명령'
                break
            }

            return [
                `${ coorMsg }: (${ __cursor.x }, ${ __cursor.y })`,
                `${ charMsg }: ${ code || '' }`
            ]
            .concat(store.map((__storageTemp, index) => [
                (__storage === __storageTemp) ? '>' : '',
                String.fromCharCode('아'.charCodeAt() + index),
                ': ',
                __storageTemp.dump('csv reverse')
            ]
            .join('')))
            .join('\n') + '\n'
        }
    }
}

