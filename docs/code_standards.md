- [1.命名规范](#1命名规范)
- [2.语法规范](#2语法规范)
- [3.书写规范](#3书写规范)

### 1.命名规范
- 建议给为每个无法直接阅读出功能的函数/方法/变量等添加注释
- 把每行代码控制在100个字符以内.
``` 
如果可以的话,尽量把行控制在80个字符一下,既有助于阅读代码,也有利于在外部文本编辑器中并排打开两个脚本。例如，在查看差异修订时。
```
</b>

- 一条语句一行
```
要避免将多个语句放在一行当中，包括条件语句。
```
</b>

- 建议规范
  
| 类型 | 约定 | 示例 |
| :-: | :-: | :-: |
| 文件名 | snake_case | yaml_parser.png |
| 类名 | PascalCase | FooBar |
| 节点/组件 | PascalCase | MainCamera |
| 函数 | camelCase | fooBar |
| 变量 | camelCase | fooBar |
| 常量 | CONSTANT_CASE | MAX_SPEED |
| 枚举名称 | PascalCase | Element |
| 枚举成员 | CONSTANT_CASE | {EARTH, WATER, AIR, FIRE}|

<br>

- 当我们为变量，函数和实例命名时, 使用 camelCase(小驼峰) 命名法。
```ts
// bad
const FOOBar = {};
const foo_bar = {};
function FOOBar () {}

// good
const fooBar = {};
function fooBar () {}
```
<br>

- 当变量、函数和实例命名涉及到缩写时，缩写在开头全部小写，在后续单词中，则全部大写。
```ts
// bad
const Id = 0;
const iD = 0;
function requireId () {}

// good
const id = 0;
const uuid = '';
function requireID () {}
class AssetUUID {}
```
<br>

- 当我们为类或者模块命名时，使用 PascalCase(大驼峰) 命名法。
```ts
// bad
const foobar = cc.Class({
    foo: 'foo',
    bar: 'bar',
});
const foobar = require('foo-bar');

// good
const FooBar = cc.Class({
    foo: 'foo',
    bar: 'bar',
});
const FooBar = require('foo-bar');
```
<br>

- 推荐使用全大写加下划线来命名“常量”。
```ts
// bad
const PRIVATE_VARIABLE = 'should not be unnecessarily uppercased within a file';

// bad
var THING_TO_BE_CHANGED = 'should obviously not be uppercased';

// bad
let REASSIGNABLE_VARIABLE = 'do not use let with uppercase variables';

// ---

// allowed but does not supply semantic value
export const apiKey = 'SOMEKEY';

// better in most cases
export const API_KEY = 'SOMEKEY';

// ---

// bad - unnecessarily uppercases key while adding no semantic value
export const MAPPING = {
    KEY: 'value'
};

// good
export const Type = {
    SIMPLE: 'value'
};
```
<br>

- 使用前置下划线 _ 当我们为私有属性命名

```ts
// bad
this.__firstName__ = 'foobar';
this.firstName_ = 'foobar';

// good
this._firstName = 'foobar';
```
<br>

- 文件名我们采用 snake_case 命名法

```ts
bash
// bad
fooBar.png
FooBar.png
foo-bar.png

// good
foo_bar.png
```
<br>

### 2.语法规范
- 当类的属性声明没有初始化式的时候，应当声明其未赋值，否则可能面临性能问题。详情请参考 Issue

```ts
// bad
class A {
    public a: number;
    constructor (a : number) {
        // 相当于此处还有一句 this.a = void 0;
        // 注意可能面临性能问题！
        this.a = a;
    }
}

// good
class A {
    public a: number = 0; // Ok.
    constructor (a : number) {
        // 相当于此处还有一句 this.a = 0;
        // 但不会引起大的性能问题
        this.a = a;
    }
}

// best
class A {
    public declare a: number;
    public b: undefined | object; // OK: b 未在构造函数中二次赋值
    public declare c: object | null;

    constructor (a: number, c: object) {
        this.a = a;
        this.c = c;
    }
}
```
<br>

- 使用 Object.create(null) 创建一个字典
```ts
// bad
const map = new Object();

// bad
const map = {};

// good
const map = Object.create(null);
```
<br>

- 使用 [ ] 创建一个数组

```ts
// bad
const array = new Array();

// good
const array = [];
```
<br>

- 尽可能在 TypeScript 代码中使用单引号 '' 来定义 string

```ts
// bad
const str = "Hello World";

// good
const str = 'Hello World';
```
<br>

- 多行 string 定义时, 尽可能使用 + 定义,减少单行字符数,提高可读性

```ts
// bad
const errorMessage = 'This is a super long error that was thrown because of Batman. When you stop to think about how Batman had anything to do with this, you would get nowhere fast.';

// bad
const errorMessage = 'This is a super long error that was thrown because \
of Batman. When you stop to think about how Batman had anything to do \
with this, you would get nowhere \
fast.';

// good
const errorMessage = 'This is a super long error that was thrown because ' +
  'of Batman. When you stop to think about how Batman had anything to do ' +
  'with this, you would get nowhere fast.';
```
<br>

- 使用 === 和 !== 而不是 == 和 !=

### 3.书写规范
- 使用缩进符(Tab) 或者 4 个空格作为缩进

```ts
// bad
function () {
∙const name;
}

// very bad
function () {
∙∙<tab>∙∙const name;
}

// good
function () {
∙∙··const name;
}

// good
function () {
    const name;
}
```
<br>

- 行尾不要留有空格，文件底部请留一个空行

```js
// bad
function () {∙
∙∙∙∙const name;∙
}
/* EOF */

// good
function () {
∙∙∙∙const name;
}

/* EOF */
```
<br>

- 语句结尾请加 ;

```js
// bad
proto.foo = function () {
}

// good
proto.foo = function () {
};

// bad
function foo () {
    return 'test'
}

// very bad
//   returns `undefined` instead of the value on the next line,
//   always happens when `return` is on a line by itself because of Automatic Semicolon Insertion!
function foo () {
    return
        'test'
}

// good
function foo () {
    return 'test';
}

// bad
function foo () {
};

// good，这里不是语句结尾
function foo () {
}
```
<br>

- 尽可能将 { 和表达式放在同一行

```ts
// bad
if ( isFoobar )
{
}

// good
if ( isFoobar ) {
}

// bad
function foobar ()
{
}

// good
function foobar () {
}

// bad
const obj =
{
    foo: 'foo',
    bar: 'bar',
}

// good
const obj = {
    foo: 'foo',
    bar: 'bar',
}
```
<br>

- 在 { 前请空一格

```js
// bad
if (isJedi){
    fight();
}
else{
    escape();
}

// good
if (isJedi) {
    fight();
} else {
    escape();
}

// bad
dog.set('attr',{
    age: '1 year',
    breed: 'Bernese Mountain Dog',
});

// good
dog.set('attr', {
    age: '1 year',
    breed: 'Bernese Mountain Dog',
});
```
<br>

- 在逻辑状态表达式 ( if, else, while, switch) 后请空一格

```js
// bad
if(isJedi) {
    fight ();
}
else{
    escape();
}

// good
if (isJedi) {
    fight();
} else {
    escape();
}
```
<br>

- 二元、三元运算符的左右请空一格

```js
// bad
const x=y+5;
const left = rotated? y: x;

// good
const x = y + 5;
const left = rotated ? y : x;

// bad
for (let i=0; i< 10; i++) {
}

// good
for (let i = 0; i < 10; i++) {
}
```
<br>

- 一些函数的声明方式

```js
// bad
const test = function () {
    console.log('test');
};

// good
function test () {
    console.log('test');
}

// bad
function test () { console.log('test'); };

// good
function test () {
    console.log('test');
}

// bad
function divisibleFunction () {
    return DEBUG ? 'foo' : 'bar';
}

// best
const divisibleFunction = DEBUG ?
    function () {
        return 'foo';
    } :
    function () {
        return 'bar';
    };

// bad
function test(){
}

// good
function test () {
}

// bad
const obj = {
    foo: function () {
    }
};

// good
const obj = {
    foo () {
    }
};

// bad
array.map(x=>x + 1);
array.map(x => {
    return x + 1;
});

// good
array.map(x => x + 1);
```
<br>

- 在 Block 定义之间请空一行

```js
// bad
if (foo) {
    return bar;
}
return baz;

// good
if (foo) {
    return bar;
}

return baz;

// bad
const obj = {
    x: 0,
    y: 0,
    foo () {
    },
    bar () {
    },
};
return obj;

// good
const obj = {
    x: 0,
    y: 0,

    foo () {
    },

    bar () {
    },
};

return obj;
```
<br>

- 请在数组、字典和枚举的最后一行使用逗号,不要使用前置逗号定义

```ts
// bad
const story = [
      once
    , upon
    , aTime
];

// good
const story = [
    once,
    upon,
    aTime,
];

// bad
const hero = {
      firstName: 'Ada'
    , lastName: 'Lovelace'
    , birthYear: 1815
    , superPower: 'computers'
};

// good
const hero = {
    firstName: 'Ada',
    lastName: 'Lovelace',
    birthYear: 1815,
    superPower: 'computers',
};
```
<br>

- 单行注释请在斜杠后面加一个空格

```js
//bad
// good
```
<br>

- 多行注释写法

```js
/*
 * good
 */
```
<br>

- 需要导出到 API 文档的多行注释写法

```js
/**
 * good
 */
```
