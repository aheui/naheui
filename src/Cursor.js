const { speed } = require('./table')

/**
 * 실행할 아희 코드의 위치를 가리키기 위한 커서입니다.
 */
module.exports = class Cursor {
    /**
     * 실행할 아희 코드의 위치를 가리키기 위한 커서입니다.
     * 
     * @param { number } x 해당하는 라인의 위치를 가리킵니다. 0부터 시작합니다.
     * @param { number } y 해당하는 라인의 글자 위치를 가리킵니다. 0부터 시작합니다.
     * @param { number } xSpeed 아희 머신이 한 단계 실행될 때 마다 이동하는 칸의 갯수입니다.
     * @param { number } ySpeed 아희 머신이 한 단계 실행될 때 마다 이동하는 칸의 갯수입니다.
     */
    constructor (x, y, xSpeed, ySpeed) {
        this.x = x || 0
        this.y = y || 0
        this.xSpeed = xSpeed || 0
        this.ySpeed = ySpeed || 0
    }

    /**
     * 코드 공간을 입력받아서 지금 커서가 가르키는 좌표에 있는 코드를 찾아내어 반환합니다.
     * 
     * @param { * } codeSpace
     */
    point (codeSpace) {
        const line = codeSpace[this.y]

        if (line) {
            return line[this.x]
        }
    }

    /**
     * 커서의 속도를 반대로 뒤집습니다.
     */
    reflect () {
        this.xSpeed = -this.xSpeed
        this.ySpeed = -this.ySpeed

        return {
            xReflected: this.xSpeed !== 0,
            yReflected: this.ySpeed !== 0
        }
    }

    /**
     * 중성 테이블의 인덱스를 입력받아서 Aheui.xSpeedTable, Aheui.ySpeedTable에 기술된 대로 커서의 속도를 전환합니다.
     * @param { string } jung 
     */
    turn (jung) {
        const xSpeed = speed.x[jung]
        const ySpeed = speed.y[jung]

        let xReflected = false
        let yReflected = false

        let xTurned = false
        let yTurned = false

        switch (xSpeed) {
        case 'reflect':
            this.xSpeed = -this.xSpeed
            if (this.xSpeed !== 0) {
                xReflected = true
            }
            break
        case undefined:
            break
        default:
            this.xSpeed = xSpeed
            if (this.xSpeed !== xSpeed) {
                xTurned = true
            }
        }

        switch (ySpeed) {
        case 'reflect':
            this.ySpeed = -this.ySpeed
            if (this.ySpeed !== 0) {
                yReflected = true
            }
            break
        case undefined:
            break
        default:
            this.ySpeed = ySpeed
            if (this.ySpeed !== ySpeed) {
                yTurned = true
            }
        }

        return {
            xReflected,
            yReflected,
            xTurned,
            yTurned
        }
    }

    /**
     * 커서가 진행하던 속도에 맞춰서 한 번 이동합니다. 코드 공간의 한쪽 끝에 다다르면 반대쪽 끝으로 이동합니다.
     * @param { * } codeSpace 
     */
    move (codeSpace) {
        this.x += this.xSpeed
        this.y += this.ySpeed

        const line = codeSpace[this.y]
        const width = (line) ? line.length : 0
        const height = codeSpace.length

        let xWrapped = false
        let yWrapped = false

        if (this.x < 0 && this.xSpeed < 0) {
            this.x = width - 1
            xWrapped = true
        }

        if (this.y < 0 && this.ySpeed < 0) {
            this.y = height - 1
            yWrapped = true
        }

        if (this.x >= width && this.xSpeed > 0) {
            this.x = 0
            xWrapped = true
        }

        if (this.y >= height && this.ySpeed > 0) {
            this.y = 0
            yWrapped = true
        }

        return {
            xSpeed: this.xSpeed,
            ySpeed: this.xSpeed,
            xWrapped,
            yWrapped
        }
    }
}
