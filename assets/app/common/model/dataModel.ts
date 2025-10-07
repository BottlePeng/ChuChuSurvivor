import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('dataModel')
export class dataModel {
    init(param) {
        param = {...{
            account: '',
            isGuest: false,
            api: ''
        }, ...param}
        let data
        if (param.isGuest) {
            data = S('guest')
        } else if (param.account) {
            data = S('data_' + param.account)
        }

        let defData = this.getDefData()
        if (H.isEmpty(data)) data = {...{}, ...defData}
        data.player.account = param.account
        data.player.api = param.api
        if (param.isGuest) data.player.isGuest = param.isGuest

        let sysInfo = H.sysInfo()
        this.sysInfo = {}
        this.sysInfo.os = sysInfo.os
        this.sysInfo.language = sysInfo.language

        this.player = {...defData.player, ...data.player}

        this.fight = {...defData.fight, ...data.fight}

        this.roles = data.roles

        this.equips = data.equips

        this.skill = data.skill

        this.chip = data.chip

        this.prop = {...defData.prop, ...data.prop}

        this.timeCount = {...defData.timeCount, ...data.timeCount}

        this.achive = {...defData.achive, ...data.achive}

        this.setting = {...defData.setting, ...data.setting}

        this.upType = 'ATK'

        for (let key in this.timeCount) {
            if (!(key in defData.timeCount)) {
                delete this.timeCount[key]
            }
        }
        for (let key in defData.timeCount) {
            if (!(key in this.timeCount)) {
                this.timeCount[key] = defData.timeCount[key]
            }
        }

        M('achive').init()
        cc.log('data', this)
    }

    getDefData() {
        return {
            player: {
                uid: H.uid(),
                sid: H.uid(10),
                parentSid: '',//介绍人sid
                childSids: [],
                hideTime: 0,
                dataTime: 0,
                uploadTime: 0,
                createTime: H.time()
            },
            fight: {
                level: 1,
                selectLevel: 1,
            },
            roles: [
                {
                    asset: 'allianceGuard',
                    HPLevel: 0,
                    ATKLevel: 0,
                    selected: true,
                },
            ],
            equips: [],
            skill: {},
            chip: {
                role: {},
                skill: {},
            },
            prop: {
                gold: 0,
                equipNum: 0,
            },
            timeCount: {
                adBox: 60 * 15,
                uploadData: 3600 * 6,
            },
            achive: {},
            setting: {
                frameRate: 60,
                gameCenter: true,
                openEquip: {
                    rank: '*',
                    star: '*',
                },
                audio: {
                    music: true,
                    effect: true,
                },
            },
        }
    }

    getPlayDay() {
        let diff = H.time() - this.player.createTime
        let day = 3600 * 24
        day = Math.floor(diff / day)
        if (day < 1) day = 1
        return day
    }

    getSaveData() {
        let data = {}
        for (let key in this) {
            if (typeof this[key] != 'function' && key.indexOf('_') == -1) {
                data[key] = H.clone(this[key])
            }
        }
        return data
    }

    save() {
        if (H.isBrowser()) return
        let data = this.getSaveData()
        if (this.player.isGuest) {
            S('guest', data)
        } else {
            data.player.dataTime = H.time()
            S('data_' + this.player.account, data)
        }
    }

    delData() {
        if (this.player.isGuest) {
            S('guest', null)
        } else {
            S('data_' + this.player.account, null)
        }
    }

    setChip(type, asset, action = '+', val) {
        val = H.num(val)
        if (!(asset in this.chip[type])) this.chip[type][asset] = 0
        if (action == '+') this.chip[type][asset] += val
        if (action == '-') this.chip[type][asset] -= val
        if (action == '=') this.chip[type][asset] = val
        if (action == '-' || action == '=') {
            if (this.chip[type][asset] < 0) this.chip[type][asset] = 0
        }
    }

    getCache(account) {
        return S('data_' + account)
    }

    setCache(data) {
        if (!data) return
        if (!data.player) return
        S('data_' + data.player.account, data)
    }
}

