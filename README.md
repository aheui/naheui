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



// TODO
