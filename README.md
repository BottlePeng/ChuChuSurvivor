- [楚楚幸存者](#楚楚幸存者)
  - [一.代码规范](#一代码规范)
  - [二.打包流程](#二打包流程)
  - [三.部分逻辑位置](#三部分逻辑位置)


# 楚楚幸存者
## 一.代码规范
- [代码规范](docs/code_standards.md)

## 二.打包流程
适配小游戏平台把subpackage/sub1 sub2 sub3 bundle类型设置为小游戏平台 (目录名称不能修改)  

[小游戏过审：JS代码混淆加密技巧](https://www.jshaman.com/document/xiaoyouxi-guoshen.html) 

[JS格式化](https://www.jshaman.com/tools/js-beautify.html)  

[JS加密/混淆](https://www.jshaman.com/)  


## 三.部分逻辑位置
- init.ts //加载远程资源(热更新)

- login.ts //读取服务器数据登录

- server.ts //服务器交互

- adMgr.ts //广告SDK

- roleBase.ts //角色资源设定位置(例如血条位置)

- roleMode.ts //玩家角色数据