本工程为单机版，跟服务器交互仅为存储和登录的时候读取数据

适配小游戏平台把subpackage/sub1 sub2 sub3 bundle类型设置为小游戏平台 (目录名称不能修改)

- init.ts //加载远程资源(热更新)

- login.ts //读取服务器数据登录

- server.ts //服务器交互

- adMgr.ts //广告SDK

fight.ts 正式上线时修改一下对应备注的代码

性能优化合批方案可参考使用cocos商城其他插件

体验地址demo 战斗场景dc 9-15 左右