const table = require('./table');
const operationMap = require('./operationMap');
const is = require('./is');
const indexing = require('./indexing');
const codeSpace = require('./codeSpace');
const Machine = require('./Machine');
const Cursor = require('./Cursor');
const Storage = require('./Storage');

/**
 * 한글로 쓰는 난해한 프로그래밍 언어인, 아희의 node.js 구현체입니다.
 */
module.exports = class Aheui {
    /**
     * 아희 코드의 초성 테이블.
     * 아희 머신에선 실행할 기능(명령)을 결정하는 용도로 사용됩니다.
     * 
     * @description 'ㄱ'부터 'ㅎ'까지 순서대로 들어있습니다.
     */
    static get choTable() {
        return table.character.cho;
    }

    /**
     * 아희 코드의 중성 테이블.
     * 아희 머신에선 커서를 이동시킬 속도를 결정하는 용도로 사용됩니다.
     * 
     * @description 'ㅏ'부터 'ㅣ'까지 순서대로 들어있습니다.
     */
    static get jungTable() {
        return table.character.jung;
    }

    /**
     * 아희 코드의 종성 테이블.
     * 일부 기능에서 동작을 구분하는 인자로 사용됩니다.
     * 
     * @description 0번째 인덱스에는 빈 문자열이 들어있고, 'ㄱ'부터 'ㅎ'까지 순서대로 들어있습니다.
     */
    static get jongTable() {
        return table.character.jong;
    }

    /**
     * Aheui.choTable의 각 항목에 대응되는 명령어에 필요한 인자의 개수를 담는 테이블.
     */
    static get parameterCounts() {
        return table.count.parameter;
    }

    /**
     * Aheui.jungTable의 각 항목이 나타내는 가로방향 속력을 담는 테이블.
     * 
     * @description 항목 중 -1은 '커서를 왼쪽으로 한 칸씩 이동'을 의미합니다.
     * @description 'reflect'는 '현재 커서의 속력에 -1을 곱한 값'을 의미합니다.
     */
    static get xSpeedTable() {
        return table.speed.x;
    }

    /**
     * Aheui.jungTable의 각 항목이 나타내는 세로방향 속력을 담는 테이블.
     * 
     * @description 항목 중 1은 '커서를 위쪽으로 한 칸씩 이동'을 의미합니다.
     * @description 'reflect'는 '현재 커서의 속력에 -1을 곱한 값'을 의미합니다.
     */
    static get ySpeedTable() {
        return table.speed.y;
    }

    /**
     * Aheui.jongTable의 각 항목의 획 수를 담는 테이블.
     * ㅂ 명령의 인자값으로 활용됩니다.
     */
    static get strokeCountTable() {
        return table.count.stroke;
    }

    /**
     * Aheui.choTable의 각 항목을 key로, 아희 머신에서 해당 항목이 의미하는 기능(함수)을 값으로 담습니다.
     */
    static get operationMap() {
        return operationMap;
    }

    /**
     * 입력받은 문자열이 아희 코드 문자인지 여부를 반환합니다.
     * 
     * @param { string } code
     */
    static isAheuiCode(code) {
        return is.aheuiCode(code);
    }

    /**
     * 입력받은 문자열이 아희 코드 문자인지 여부를 반환합니다.
     * 
     * @description isAheuiCode의 부정과 같습니다.
     * @param { string } code 
     */
    static isComment(code) {
        return is.comment(code);
    }

    /**
     * 입력받은 문자의 초성을 걸러내서 일치하는 초성 테이블 항목의 인덱스를 반환합니다.
     * 인덱스가 들어왔을 경우에는 그대로 반환합니다.
     * 
     * @description 초성에 대해서 처리합니다.
     */
    static cho(char) {
        return indexing.cho(char);
    }

    /**
     * 입력받은 문자의 초성을 걸러내서 일치하는 초성 테이블 항목의 인덱스를 반환합니다.
     * 인덱스가 들어왔을 경우에는 그대로 반환합니다.
     * 
     * @description 중성에 대해서 처리합니다.
     */
    static jung(char) {
        return indexing.jung(char);
    }

    /**
     * 입력받은 문자의 초성을 걸러내서 일치하는 초성 테이블 항목의 인덱스를 반환합니다.
     * 인덱스가 들어왔을 경우에는 그대로 반환합니다.
     * 
     * @description 종성에 대해서 처리합니다.
     */
    static jong(char) {
        return indexing.jong(char);
    }

    /**
     * 아래 코드와 같은 객체를 반환합니다.
     * 
     * @description char가 유효하지 않은 아희 코드일 경우 cho, jung, jong에는 -1이 들어갑니다.
     * @param { string } char 
     */
    static code(char) {
        return codeSpace.code(char);
    }

    /**
     * 아희 소스코드를 입력받아서 Aheui.code 메서드의 리턴값으로 이루어진 행우선의 2차원 배열을 반환합니다.
     * 
     * @param {*} sourceCode 
     */
    static codeSpace(sourceCode) {
        return codeSpace(sourceCode);
    }

    /**
     * 아희 코드를 해석해서 실행시키는 상태머신입니다.
     */
    static get Machine() {
        return Machine;
    }

    /**
     * 실행할 아희 코드의 위치를 가르키기 위한 커서입니다.
     */
    static get Cursor() {
        return Cursor;
    }

    /**
     * 아희 머신이 사용하는 저장공간입니다. 인자로 받는 type에 따라 조금씩 다르게 작동합니다. type으로 받는 값은 다음과 같습니다:
     */
    static get Storage() {
        return Storage;
    }
}
