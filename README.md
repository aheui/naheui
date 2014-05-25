# 나희

나희는 한글로 쓰는 난해한 프로그래밍 언어 [아희](http://aheui.github.io/)의
[node.js](http://nodejs.org/) 구현체입니다.

[![NPM](https://nodei.co/npm/naheui.png?compact=true)](https://nodei.co/npm/naheui/)


## 사용법

나희를 사용하려면 우선 [node.js 와 npm](http://nodejs.org/)이 설치돼있어야 합니다.


### 커맨드라인 인터페이스

 설치: `npm install -g naheui`

 실행: `naheui [아희 프로그램 경로]`


### 라이브러리

 설치: `npm install --save naheui`

#### 예제
```js
var Aheui = require('naheui');

var helloworld = [
    '밣붍맣뱓몋두붖멓',
    '뭏따맣불뽀뿌다맣',
    '뭏누뻐쀀쀀쀀떠묳',
    '붖다뭏다쀀쀀뽀도',
    '뚜붇뱛몋도뼈타뭏',
    '붖나빠밠다맣볼뵳',
    '다맣맣희지민제작'
].join('\n');

var machine = new Aheui.Machine(Aheui.codeSpace(helloworld));
machine.run();
```

#### API

##### array `Aheui.choTable`
아희 코드의 초성 테이블. `ㄱ`부터 `ㅎ`까지 순서대로 들어있습니다.

아희 머신에선 실행할 기능(명령)을 결정하는 용도로 사용됩니다.

##### array `Aheui.jungTable`
아희 코드의 중성 테이블. `ㅏ`부터 `ㅣ`까지 순서대로 들어있습니다.

아희 머신에선 커서를 이동시킬 속도를 결정하는 용도로 사용됩니다.

##### array `Aheui.jongTable`
아희 코드의 종성 테이블.
`0`번째 인덱스에는 빈 문자열이 들어있고 그 뒤는 `ㄱ`부터 `ㅎ`까지 순서대로 들어있습니다.

일부 기능에서 동작을 구분하는 인자로 사용됩니다.

##### array `Aheui.xSpeedTable`, `Aheui.ySpeedTable`
`Aheui.jungTable`의 각 항목이 나타내는 속력을 담는 테이블.
`Aheui.xSpeedTable`은 가로방향 속력을 담고 `Aheui.ySpeedTable`은 세로방향 속력을 담습니다.

가령 `Aheui.xSpeedTable`의 항목 중 `-1`은 '커서를 왼쪽으로 한 칸씩 이동'을 의미하고,
`Aheui.ySpeedTable`의 항목 중 `1`은 '커서를 위쪽으로 한 칸씩 이동'을 의미합니다.

`'reflect'`는 "현재 커서의 속력에 `-1`을 곱한 값"을 의미합니다.

##### array `Aheui.strokeCountTable`
`Aheui.jongTable`의 각 항목의 획 수를 담는 테이블.
`ㅂ` 명령의 인자값으로 활용됩니다.

##### array `Aheui.operationMap`
`Aheui.choTable`의 각 항목을 key로, 아희 머신에서 해당 항목이 의미하는 기능(함수)을 값으로 담습니다.

##### function (Aheui.Machine machine, int jong): boolean `Aheui.operationMap[ key ]`
각 함수는 아희 머신과 종성 코드(종성 테이블의 인덱스)를 인자로 받습니다.

함수가 `true`를 리턴하면 아희 머신이 동작을 멈춥니다.

##### function ([string | object] code): boolean `Aheui.isAheuiCode`, `Aheui.isComment`
입력받은 문자열이 아희 코드 문자인지 여부를 반환합니다.

`Aheui.isComment`는 그 것의 부정을 반환합니다.

##### function ([number | string | object] code): int `Aheui.cho`, `Aheui.jung`, `Aheui.jong`
입력받은 문자의 초성을 걸러내서 일치하는 초성 테이블 항목의 인덱스를 반환합니다.

같은 작업을 `Aheui.jung`은 중성, `Aheui.jong`은 종성에 대해서 처리합니다.

인덱스가 들어왔을 경우에는 그대로 반환합니다.

##### function (string char): object `Aheui.code`
아래 코드와 같은 객체를 반환합니다.

```js
{
    char: char,
    cho: Aheui.cho(char),
    jung: Aheui.jung(char),
    jong: Aheui.jong(char),
    toString: function () {
        return this.char;
    }
}
```

##### function (string sourceCode): object `Aheui.codeSpace`
아희 소스코드를 입력받아서 `Aheui.code`—가 반환하는 객체—로 이루어진
행우선(line major)의 2차원 배열을 반환합니다.

##### class (object codeSpace) `Aheui.Machine`
아희 코드를 해석해서 실행시키는 상태머신입니다.

###### Aheui.Cursor `machine.cursor`
실행할 아희 코드의 위치를 가르키는 객체입니다.

###### Aheui.Storage `machine.storage`
현재 설정된 저장소입니다. 스택이나 큐, 혹은 확장기능을 위한 통로일 수 있습니다.

###### function (function (int result) terminateFunction) `machine.run`
아희 프로그램을 실행시킵니다.

실행이 종료되었을 때 호출된 함수(`terminateFunction`)를 인자로 받습니다.
아희 머신은 실행이 종료되면 현재 저장공간(`machine.storage`)에서 값을 하나 빼와서
`terminateFunction`으로 인자로 넘겨줍니다.

###### function () `machine.step`
아희 코드를 한 단계만 실행합니다.

###### function (string type): any `machine.input`
입력을 요청하는 `ㅂ` 명령이 실행될 때 호출될 함수입니다.

`type`으로 `'number'`나 `'character'`가 들어올 수 있습니다.

`machine.input`은 요청 타입에 따라 적절한 값을 반환해주면 됩니다.
`'number'` 타입으로는 정수를, `'character'` 타입으로는 길이 하나짜리 문자열을 반환하는 것이 적절합니다.

###### function (any value) `machine.output`
출력을 요쳥하는 `ㅁ` 명령이 실행될 때 호출될 함수입니다.

`value`로는 보통 숫자 또는 문자가 들어오지만 `machine.storage`에 들어있는 값에 따라서
다른 타입의 값이 들어갈 수도 있습니다.

###### function ([number | string | object] code): Aheui.Storage `machine.getStorage`
아희 종성 코드를 인자로 받아서 해당하는 `Aheui.Storage` 인스턴스를 반환합니다.

###### function ([number | string | object] code) `machine.selectStorage`
아희 종성 코드를 인자로 받아서 해당하는 `Aheui.Storage` 인스턴스를 `machine.stoarge`에 대입합니다.

##### class (int x, int y, int xSpeed, int ySpeed) `Aheui.Cursor`
실행할 아희 코드의 위치를 가르키기 위한 커서입니다.

###### int `cursor.x`, `cursor.y`
코드 공간—`Aheui.codeSpace`가 반환하는 객체—의 좌표입니다.

`cursor.y`는 라인을 가르키고, `cursor.x`는 해당하는 라인의 글자위치를 가르킵니다.
둘 다 `0`부터 시작합니다.

###### int `cursor.xSpeed`, `cursor.ySpeed`
커서가 한 번—아희 머신이 한 단계 실행될 때마다 한 번씩—에 이동하는 칸의 갯수입니다.

음수일 경우에는 반대방향으로 이동합니다.
x축으로는 오른쪽, y축으로는 아래쪽이 기본 방향입니다.

###### function (object codeSpace): object `cursor.point`
코드 공간을 입력받아서 지금 커서가 가르키는 좌표에 있는 코드를 찾아내어 반환합니다.

###### function () `cursor.reflect`
커서의 속도를 반대로 뒤집습니다.

###### function (int jung) `cursor.turn`
중성 테이블의 인덱스를 입력받아서 `Aheui.xSpeedTable`, `Aheui.ySpeedTable`에 기술된 대로
커서의 속도를 전환합니다.

###### function (object codeSpace) `cursor.move`
커서가 진행하던 속도에 맞춰서 한 번 이동합니다. 코드 공간의 한쪽 끝에 다다르면
반대쪽 끝으로 이동합니다.

##### class (string type) `Aheui.Storage`
아희 머신이 사용하는 저장공간입니다. 인자로 받는 `type`에 따라 조금씩 다르게 작동합니다.
`type`으로 받는 값은 다음과 같습니다:

 * `'stack'`: 저장공간이 스택 자료형처럼 동작합니다.
 * `'queue'`: 마찬가지로 큐 자료형처럼 동작합니다.
 * `'pipe'`: 확장기능을 위한 통로로 동작합니다. 특별히 정해진 확장기능은 없습니다.
             나희에게 정의를 덮어씌우지 않으면 큐와 똑같이 동작합니다.

###### function (any v): int `storage.push`
저장공간에 값을 집어넣습니다.
스택이나 큐일 경우엔 값을 넣은 후의 저장공간 길이를 반환합니다.

###### function (): any `storage.pop`
저장공간에서 하나의 값을 빼옵니다.

저장공간이 스택일 경우엔 나중에 집어넣은 값이, 큐일 경우엔 먼저 집어넣은 값이 반환됩니다.

###### function (): int `storage.duplicate`
저장공간에서 값을 빼 올 위치에다 그 값을 하나 더 집어넣습니다.
스택이나 큐일 경우엔 값을 넣은 후의 저장공간 길이를 반환합니다.

스펙에서는 확장기능 통로일 경우에, 마지막으로 보낸 값을 한 번 더 보내도록 정의되어 있으나
나희에게 정의를 덮어씌우지 않으면 큐와 똑같이 동작합니다.

###### function () `storage.swap`
저장공간에서 값을 빼 올 위치에 있는 두 항목의 순서를 뒤집습니다.

확장기능 통로에 대해서는 정해진 것이 없으나
나희에게 정의를 덮어씌우지 않으면 큐와 똑같이 동작합니다.

###### function (Aheui.Storage to) `storage.send`
값을 하나 뽑아서(`storage.pop`) 저장공간 `to`에 값을 집어넣습니다(`storage.push`).
