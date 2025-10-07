import { _decorator, sys, UIOpacity } from 'cc';
import { DEV } from 'cc/env'
const { ccclass } = _decorator;

import BigNumber from './lib/BigNumber.js'
import CircularJSON from './lib/circular-json.js'

@ccclass('helper')
export class helper {
    request(url, data, param) {
        param = {...{
            method: 'POST',
            dataType: 'json' //json || form 和 其他
        }, ...param}
        return new Promise((resolve, reject) => {
            if (param.dataType == 'json') {
                param.headers = {'Content-type': 'application/json'}
            } else {
                param.headers = {'Content-type': 'text/plain;charset=UTF-8'}
            }
            const formatData = (data) => {
                let res = ''
                for (let key in data) {
                    res += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
                    res += '&'
                }
                res = res.substr(0, res.length - 1)
                return res
            }
            let sendParam: any = {}
            sendParam.method = param.method
            sendParam.headers = param.headers
            if (param.method == 'GET') {
                if (data) url += '?' + formatData(data)
            } else {
                if (data) {
                    if (param.dataType == 'json') {
                        sendParam.body = JSON.stringify(data)
                    } else if (param.dataType == 'form') {
                        sendParam.body = formatData(data)
                    } else {
                        sendParam.body = data
                    }
                }
            }
            let mini = this.mini()
            if (mini) {
                mini.request({
                    url: url,
                    data: data,
                    method: param.method,
                    header: param.headers,
                    dataType: param.dataType,
                    success: res => {
                        if (res.statusCode == 404) {
                            reject('404 not found')
                            return
                        }
                        if (res.errMsg != 'request:ok') {
                            reject(res.errMsg)
                            return
                        }
                        if (this.isJson(res.data)) {
                            resolve(JSON.parse(res.data))
                            return
                        }
                        resolve(res.data)
                    },
                    fail: err => {
                        reject(err)
                    }
                })
                return
            }
            fetch(url, sendParam).then(response => {
                if (response.status == 404) {
                    reject('404 not found')
                    return
                }
                if (param.dataType == 'json') {
                    return response.json()
                }
                return response.text()
            }).then(res => {
                if (this.isJson(res)) {
                    resolve(JSON.parse(res))
                    return
                }
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    isJson(str) {
        if (typeof str == 'string') {
            let val = Number(str)
            if (typeof val === 'number' && !isNaN(val)) {
                return false
            }
            try {
                JSON.parse(str)
                return true
            } catch (e) {
                return false
            }
        }
        return false
    }

    //nanoid
    uid(size = 21) {
        const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
        let id = ''
        let i = size
        while (i--) {
            id += urlAlphabet[(Math.random() * 64) | 0]
        }
        return id
    }

    isDev() {
        return DEV
    }

    isNative() {
        return sys.isNative
    }

    isBrowser() {
        return sys.isBrowser
    }

    isAndroid() {
        return sys.os == sys.OS.ANDROID && sys.isNative
    }

    isIos() {
        return sys.os == sys.OS.IOS && sys.isNative
    }

    isMini() {
        return this.mini() ? true : false
    }

    //是否简体中文
    isHans() {
        let language = sys.language.toLowerCase()
        if (language === 'zh') {
            let languageCode = sys.languageCode.toLowerCase()
            if (languageCode.indexOf('hans') != -1
            || languageCode == 'zh'
            || languageCode == 'zh-cn'
            || languageCode == 'zh_cn') {
                return true
            }
        }
        return false
    }

    //val || obj || arr
    isEmpty(obj) {
        if (!obj) return true
        if (Object.keys(obj).length === 0) return true
        return false
    }

    isArr(val) {
        return Object.prototype.toString.call(val) === '[object Array]'
    }

    isStr(val) {
        return typeof val == 'string'
    }

    isNum(val) {
        return typeof val == 'number'
    }

    isBool(val) {
        return typeof val === 'boolean'
    }

    isFunc(val) {
        return typeof val === 'function'
    }

    isObj(val) {
        return typeof val == 'object'
    }

    isPromise(val) {
        return !!val && typeof val.then === 'function'
    }

    isToday(localTime, serverTime) {
        const localDate = new Date(this.date('Y-m-d', localTime))
        const serverDate = new Date(this.date('Y-m-d', serverTime))
        return (
            localDate.getDate() === serverDate.getDate() &&
            localDate.getMonth() === serverDate.getMonth() &&
            localDate.getFullYear() === serverDate.getFullYear()
        )
    }

    is$(component, component2) {
        if (component === component2) return true
        return component instanceof component2
    }

    num(num, float = 0) {
        num = Number(num)
        if (isNaN(num)) return 0
        if (float == 0) return Math.round(num)
        if (float == 1) return Math.round(num * 10) / 10
        if (float == 2) return Math.round(num * 100) / 100
        return num
    }

    numAbbr(num, float = 2) {
        if (!this.num(num)) return 0
        if (num < 100000) return this.num(num, float)
        num = this.num(num)
        num = new BigNumber(num).toFixed()
        let length = num.length
        let units = ['K', 'M', 'G', 'T']
        let unitIndex = Math.ceil(length / 3) - 2
        if (unitIndex >= 4) {
            let ens = 'abcdefghijklmnopqrstuvwxyz'.split('')
            ens.forEach((pre) => {
                ens.forEach((val) => {
                    units.push(pre + val)
                })
            })
        }
        let unit = units[unitIndex]
        let leftLength = length - (3 * (Math.ceil(length / 3) - 1))
        let decimal = num.substring(leftLength, leftLength + float)
        let res = num.substring(0, leftLength)
        if (decimal != '00') res += '.' + decimal
        res += unit
        return res
    }

    clone(obj) {
        return CircularJSON.parse(CircularJSON.stringify(obj))
    }

    randSort(arr) {
        let len = arr.length
        for (let i = len - 1; i >= 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1))
            let temp = arr[i]
            arr[i] = arr[randomIndex]
            arr[randomIndex] = temp
        }
        return arr
    }

    randArr(arr, limit = null) {
        if (limit === null) {
            if (!arr || arr.length < 1) return
            let res = arr[Math.floor((Math.random() * arr.length))]
            return res
        }
        limit = this.num(limit)
        if (limit < 1 || !arr || arr.length < 1) return []
        let tempArr = []
        for (let i in arr) {
            tempArr.push(arr[i])
        }
        let resArr = []
        for (let i = 0; i < limit; i++) {
            if (tempArr.length > 0) {
                let arrIndex = Math.floor(Math.random() * tempArr.length)
                resArr[i] = tempArr[arrIndex]
                tempArr.splice(arrIndex, 1)
            } else {
                break
            }
        }
        return resArr
    }

    randNum(min, max, float = false) {
        if (float === false) {
            return Math.round(Math.random() * (max - min)) + min
        } else {
            return Math.random() * (max - min) + min
        }
    }

    calProb(calVal) {
        if (!calVal) return 0
        calVal = calVal * 10
        if (calVal >= 1000) return true
        let prob = Math.floor(Math.random() * 1000)
        if (prob < calVal) return true
        return false
    }

    trim(str) {
        if (typeof str != 'string') return str
        if (!str) return ''
        return str.replace(/(^\s*)|(\s*$)/g, "")
    }

    time(milli = false) {
        if (milli) return new Date().getTime()
        return parseInt(new Date().getTime().toString().substr(0, 10))
    }

    date(str = 'Y-m-d H:i:s', t) {
        if (!t) t = this.time()
        t = t.toString() + '000'
        let d = new Date()
        d.setTime(parseInt(t))
        let _m = d.getMonth() + 1,
            _d = d.getDate(),
            _H = d.getHours(),
            _i = d.getMinutes(),
            _s = d.getSeconds(),
            format = {
                'Y': d.getFullYear(), // 年
                'm': _m.toString().length == 1 ? '0' + _m : _m, // 月
                'd': _d.toString().length == 1 ? '0' + _d : _d, // 日
                'H': _H.toString().length == 1 ? '0' + _H : _H, // 时
                'i': _i.toString().length == 1 ? '0' + _i : _i, // 分
                's': _s.toString().length == 1 ? '0' + _s : _s // 秒
            }
        for (var i in format) {
            str = str.replace(new RegExp(i), format[i])
        }
        return str
    }

    weekDay(time) {
        if (!time) time = this.time()
        time = time.toString() + '000'
        const weekDay = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        let date = new Date()
        date.setTime(parseInt(time))
        return weekDay[date.getDay()]
    }

    secondFormat(second, format = '{h}:{m}:{s}') {
        let h = parseInt((second / 60 / 60 % 24).toString())
        let hh = h < 10 ? '0' + h : h
        let m = parseInt((second / 60 % 60).toString())
        let mm = m < 10 ? '0' + m : m
        let s = parseInt((second % 60).toString())
        let ss = s < 10 ? '0' + s : s
        return format.replace(/{h}/g, h).replace(/{hh}/g, hh).replace(/{m}/g, m).replace(/{mm}/g, mm).replace(/{s}/g, s).replace(/{ss}/g, ss)
    }

    versionFormat(version) {
        return 'v' + version.toString().split('').join('.')
    }

    toString(string) {
        if (!string) return ''
        if (typeof string === 'object') string = String(string)
        if (string.replace) {
            string = string.replace(/\\n/g, '\n')
            string = string.replace(/<br\/> /g, '<br/>')
        }
        return string
    }

    pageArr(arr, size) {
        let length = arr.length
        let newArr = []
        let i = Math.ceil(length / size * 1.0)
        let j = 0
        while(j < i) {
            let spare= length - j * size >= size ? size : length - j * size
            let temp = arr.slice(j * size, j * size + spare)
            newArr.push(temp)
            j++
        }
        return newArr
    }

    forArr(arr, callFunc) {
        return new Promise(resolve => {
            if (!arr) {
                resolve()
                return
            }
            let len = arr.length
            if (len <= 0) {
                resolve()
                return
            }
            let promises = []
            for (let i = 0; i < len; i++) {
                let info = arr[i]
                if (info == undefined) continue
                let res = callFunc(info, i)
                if (this.isPromise(res)) {
                    promises.push(res)
                } else {
                    if (res) break
                }
            }
            Promise.all(promises).then(() => {
                resolve()
            })
        })
    }

    delArr(arr, val) {
        if (!this.isArr(arr) || arr.length < 1) return
        arr.splice(arr.indexOf(val), 1)
    }

    indexArr(arr, index) {
        index = Math.abs(index)
        if (index < arr.length) return arr[index]
        if (index == arr.length) return arr[0]
        let idx = (index % arr.length) + 1
        if (idx == 0) idx = arr.length
        return arr[idx - 1]
    }

    //插值运算
    //a 初始值 b 目标值
    lerp(a, b, dt) {
        return a + (b - a) * dt
    }

    //角度转弧度
    angleToRadian(angle) {
        let radian = Math.PI / 180 * angle
        return radian
    }

    //弧度转角度
    radianToAngle(radian) {
        let angle = radian / Math.PI * 180
        return angle
    }

    //角度转方向
    angleToDir(angle) {
        let radian = this.angleToRadian(angle)
        let cos = Math.cos(radian)
        let sin = Math.sin(radian)
        return cc.v3(cos, sin).normalize()
    }

    //方向转角度
    dirToAngle(dir) {
        let radian = Math.atan2(dir.y, dir.x)
        return this.radianToAngle(radian)
    }

    //v3
    posToDir(byWorldPos, toWorldPos) {
        return toWorldPos.clone().subtract(byWorldPos).normalize()
    }

    //传入 向量缩放至单位长度的结果
    //eg: toPos.sub(byPos).normalize()
    //0=下 1=左下 2=左 3=左上 4=上 5=右上 6=右 7=右下
    getDir(normalized, num = 8) {
        let dirX = normalized.x
        let dirY = normalized.y
        if (dirX === 0 && dirY === 0) return 0
        let angle = Math.atan2(dirY, dirX)
        let dir = Math.round((-angle + Math.PI) / (Math.PI / 4))
        dir = dir > 5 ? dir - 6 : dir + 2
        if (num == 4) {
            if (dir === 2 || dir === 1 || dir === 3) return 2
            if (dir === 6 || dir === 5 || dir === 7) return 6
        }
        return dir
    }

    getNodePath(node) {
        if (!node) return ''
        let path = node.name
        let parent = node.parent
        while (parent) {
            path = `${parent.name}/${path}`
            parent = parent.parent
        }
        return path
    }

    //初始图片方向右边
    getDirAngle(normalized) {
        return Math.atan2(normalized.y, normalized.x) * 180 / Math.PI
    }

    //平均值
    avgNum(arr, key) {
        if (this.isEmpty(arr)) return 0
        let sum = 0
        for(let i = 0; i < arr.length; i++) {
            sum += key ? arr[i][key] : arr[i]
        }
        return this.num(sum / arr.length)
    }

    //最大值
    maxNum(arr, key) {
        if (this.isEmpty(arr)) return 0
        let max = key ? arr[0][key] : arr[0]
        for (let i = 1; i < arr.length; i++) {
            let num = key ? arr[i][key] : arr[i]
            if (num > max) max = num
        }
        return this.num(max)
    }

    //最小值
    minNum(arr, key) {
        if (this.isEmpty(arr)) return 0
        let min = key ? arr[0][key] : arr[0]
        for (let i = 1; i < arr.length; i++) {
            let num = key ? arr[i][key] : arr[i]
            if (num < min) min = num
        }
        return this.num(min)
    }

    //总和
    sumNum(arr, key) {
        if (this.isEmpty(arr)) return 0
        let sum = 0
        for (let i = 0; i < arr.length; i++) {
            sum += key ? arr[i][key] : arr[i]
        }
        return this.num(sum)
    }

    uniPush(arr, val, key) {
        if (key) {
            let have = arr.some(a => a[key] == val[key])
            if (!have) arr.push(val)
        } else {
            let have = arr.indexOf(val) != -1
            if (!have) arr.push(val)
        }
    }

    $(node, component, isAll = false) {
        if (!node) return null
        if (!component) return null
        if (isAll) return node.getComponents(component)
        return node.getComponent(component)
    }

    add$(node, component, checkHas = false) {
        if (checkHas) {
            let comp = node.getComponent(component)
            if (comp) return comp
        }
        return node.addComponent(component)
    }

    //args: 组件 > 父节点
    inst(target, ...args) {
        let component = !this.is$(args[0], cc.Node) ? args[0] : null
        let parentNode = component ? args[1] : args[0]
        let node = cc.instantiate(target)
        node = this.resetNode(node)
        if (parentNode) node.parent = parentNode
        return component ? this.add$(node, component, true) : node
    }

    resetNode(node) {
        if (!node || !node.isValid) return
        node.setWorldPosition(0, 0, 0)
        node.setPosition(0, 0, 0)
        node.setScale(1, 1, 1)
        node.angle = 0
        node.active = true
        return node
    }

    dist(by, to) {
        let byPos = (by && by.getPosition) ? by.getPosition() : by
        let toPos = (to && to.getPosition) ? to.getPosition() : to
        return cc.Vec3.distance(byPos, toPos)
    }

    toAR(byNode, toNode) {
        if (!this.is$(byNode, cc.Node) || !this.is$(toNode, cc.Node) || !byNode.parent) {
            return cc.v3()
        }
        let byParentUITransform = byNode.parent.getComponent(cc.UITransformComponent)
        let toUITransform = toNode.getComponent(cc.UITransformComponent)
        if (!byParentUITransform || !toUITransform) {
            return cc.v3()
        }
        let pos = byParentUITransform.convertToWorldSpaceAR(byNode.getPosition())
        let toPos = toUITransform.convertToNodeSpaceAR(pos)
        return toPos
    }

    //args: 组件 > 父节点
    find(path, ...args) {
        let component = !(args[0] instanceof cc.Node) ? args[0] : null
        let parentNode = component ? args[1] : args[0]

        const find = (path, parentNode) => {
            if (!parentNode) parentNode = cc.find('Canvas')
            let node = cc.find(path, parentNode)
            if (node) return node
            let children = parentNode.children
            for (let i = 0; i < children.length; i++) {
                node = find(path, children[i])
                if (node) return node
            }
            return null
        }
        let node = find(path, parentNode)
        if (!node) return
        return component ? node.getComponent(component) : node
    }

    findAll(parentNode) {
        let res = [parentNode]
        const find = (node, flag = true) => {
            if (node.children.length > 0) {
                for (let i = 0; i < node.children.length; i++) {
                    res.push(node.children[i])
                    find(node.children[i], false)
                }
            } else {
                if (flag) res.push(node)
            }
        }
        find(parentNode)
        return res
    }

    setLayer(node, layer) {
        if (node.layer == layer) return
        this.forArr(this.findAll(node), a => {
            a.layer = layer
        })
    }

    //param > stepFunc > repeatCount
    playAnim(anim, ...args) {
        let param = {
            name: '',
            events: [],
            speedMul: 1,
        }
        let stepFunc = (step, val) => {}
        let repeatCount = 0
        if (this.isObj(args[0])) {
            param = {...param, ...args[0]}
            if (this.isFunc(args[1])) stepFunc = args[1]
            if (this.isNum(args[2])) repeatCount = args[2]
        }
        if (this.isFunc(args[0])) {
            stepFunc = args[0]
            if (this.isNum(args[1])) repeatCount = args[1]
        }
        if (this.isNum(args[0])) {
            repeatCount = args[0]
        }

        return new Promise(resolve => {
            if (!anim) return
            if (!param.name) param.name = anim.defaultClip.name
            if (param.events.length < 1) param.events = [param.name]
            let animState = anim.getState(param.name)
            if (!animState) {
                log('[helper.playAnim] !animState')
                anim.node.destroy()
                return
            }
            animState.speed = param.speedMul
            if (repeatCount > 0) {
                animState.repeatCount = repeatCount
            }
            animState.off('finished')
            animState.once('finished', () => {
                resolve()
            })
            let step = 1
            this.forArr(param.events, event => {
                anim[event] = val => {
                    stepFunc(step, val)
                    step++
                }
            })
            anim.play(param.name)
        })
    }

    mini() {
        if (typeof wx != 'undefined') return wx
        return null
    }

    //return {nickname, faceUrl}
    //回调函数用来提示用户点击屏幕授权
    //btnCreateFunc = 创建按钮时触发
    //btnTouchFunc = 点击按钮后触发
    getMiniUserInfo(btnCreateFunc, btnTouchFunc) {
        let mini = this.mini()
        if (!mini) return
        return new Promise((resolve, reject) => {
            mini.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) {
                        mini.getUserInfo({
                            success: userRes => {
                                resolve({
                                    nickname: userRes.userInfo.nickName,
                                    faceUrl: userRes.userInfo.avatarUrl
                                })
                            },
                            fail: err => {
                                reject(err)
                            }
                        })
                        return
                    }
                    if (btnCreateFunc) btnCreateFunc()
                    let btn = mini.createUserInfoButton({
                        type: 'text',
                        text: '',
                        style: {
                            left: 0,
                            top: 0,
                            width: cc.screen.windowSize.width,
                            height: cc.screen.windowSize.height,
                            backgroundColor: '#00000000',//最后两位为透明度
                            color: '#ffffff',
                            fontSize: 20,
                            textAlign: 'center',
                            lineHeight: cc.screen.windowSize.height,
                        }
                    })
                    btn.onTap(userRes => {
                        if (btnTouchFunc) btnTouchFunc()
                        btn.destroy()
                        if (userRes.errMsg === 'getUserInfo:ok') {
                            resolve({
                                nickname: userRes.userInfo.nickName,
                                faceUrl: userRes.userInfo.avatarUrl
                            })
                            return
                        }
                        reject()
                    })
                },
                fail: err => {
                    reject(err)
                }
            })
        })
    }

    getMiniVersion() {
        if (!this.mini()) return ' develop'
        let miniInfo = this.mini().getAccountInfoSync()
        return miniInfo.miniProgram.version + ' ' + miniInfo.miniProgram.envVersion
    }

    exitGame() {
        let mini = this.mini()
        if (mini) {
            mini.exitMiniProgram()
            return
        }
        cc.game.end()
    }

    sysInfo() {
        let res = {}
        res.os = cc.sys.os
        res.platform = cc.sys.platform
        res.language = cc.sys.language
        res.languageCode = cc.sys.languageCode
        res.screenSize = {}
        res.screenSize.width = cc.screen.windowSize.width
        res.screenSize.height = cc.screen.windowSize.height
        return res
    }

    winSize() {
        let width = cc.screen.windowSize.width / cc.view.getScaleX()
        let height = cc.screen.windowSize.height / cc.view.getScaleY()
        return cc.size(width, height)
    }

    openUrl(url) {
        cc.sys.openURL(url)
    }

    fileName(path) {
        let pathArr = path.split('.').pop()
        let fileName = path.slice(0, -pathArr.length - 1)
        let lastSlashIndex = fileName.lastIndexOf('/')
        let lastBackslashIndex = fileName.lastIndexOf('\\')
        let index = Math.max(lastSlashIndex, lastBackslashIndex)
        if (index !== -1) fileName = fileName.slice(index + 1)
        return fileName
    }

    sleep(comp, second) {
        return new Promise(resolve => {
            comp.scheduleOnce(resolve, second)
        })
    }
}

