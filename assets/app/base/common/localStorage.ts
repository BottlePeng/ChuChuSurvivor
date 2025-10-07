import { _decorator, sys } from 'cc';
const { ccclass } = _decorator;

@ccclass('localStorage')
export class localStorage {
    cryptKey = ''
    appName = ''

    init(appName) {
        this.appName = appName
        this.cryptKey = R('crypt').md5('!QAZ@WSX#EDC')
    }

    encode(data) {
        return R('crypt').encode(data, this.cryptKey)
    }

    decode(cryptStr) {
        return R('crypt').decode(cryptStr, this.cryptKey)
    }

    get(key) {
        try {
            key = this.appName + '_' + key
            let data = sys.localStorage.getItem(key)
            if (data) data = JSON.parse(this.decode(data))
            return data
        } catch (err) {
        }
    }

    set(key, data) {
        key = this.appName + '_' + key
        cc.sys.localStorage.setItem(key, this.encode(JSON.stringify(data)))
    }

    clear(key) {
        key = this.appName + '_' + key
        cc.sys.localStorage.removeItem(key)
    }

    getAll() {
        if (cc.sys.isNative) return
        let res = {}
        for (let key in cc.sys.localStorage) {
            if (typeof cc.sys.localStorage[key] === 'string') {
                let appKey = key.replace(this.appName + '_', '')
                if (key == this.appName + '_' + appKey) {
                    res[appKey] = this.get(appKey)
                }
            }
        }
        return res
    }

    clearAll() {
        if (cc.sys.isNative) {
            cc.sys.localStorage.clear()
            return
        }
        for (let key in cc.sys.localStorage) {
            if (typeof cc.sys.localStorage[key] === 'string') {
                let appKey = key.replace(this.appName + '_', '')
                if (key == this.appName + '_' + appKey) {
                    this.clear(appKey)
                }
            }
        }
    }
}

