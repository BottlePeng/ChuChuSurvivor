import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('achiveModel')
export class achiveModel {
    eventType = {
        INC_COUNT: 'achiveModel.incCount#type#AssetOrKey',
        INC_LEVEL: 'achiveModel.incLevel#type#AssetOrKey',
    }

    defData = {
        lookAd: {
            video: 5
        },
        gainProp: {
            gold: 5000,
            equipNum: 10
        },
        useRole: 2,
        useSkill: 5,
        usePassiveSkill: 5,
    }

    init() {
        for (let key in M('data').achive) {
            if (!(key in this.defData)) {
                delete M('data').achive[key]
            }
        }

        for (let key in this.defData) {
            if (!(key in M('data').achive)) M('data').achive[key] = {}
            if (key == 'useRole' || key == 'useSkill' || key == 'usePassiveSkill') {
                let datas
                let dataKey
                if (key == 'useRole') {
                    dataKey = 'asset'
                    datas = M('role').getPlayerBaseDatas()
                }
                if (key == 'useSkill') {
                    dataKey = 'name'
                    datas = M('skill').getBaseDatas()
                }
                if (key == 'usePassiveSkill') {
                    dataKey = 'name'
                    datas = M('skill').getPassiveBaseDatas()
                }
                datas.forEach(a => {
                    if (!(a[dataKey] in M('data').achive[key])) {
                        M('data').achive[key][a[dataKey]] = {
                            total: 0,
                            count: 0,
                            level: 0,
                        }
                    }
                })
            } else {
                for (let k in this.defData[key]) {
                    if (!(k in M('data').achive[key])) {
                        M('data').achive[key][k] = {
                            total: 0,
                            count: 0,
                            level: 0,
                        }
                    }
                }
            }
        }
    }

    incCount(type, assetOrKey, val = 1) {
        M('data').achive[type][assetOrKey].count += val
        M('data').achive[type][assetOrKey].total += val
        E.emit(this.eventType.INC_COUNT, type, assetOrKey)
    }

    incLevel(type, assetOrKey) {
        let nextCount = this.getNextCount(type, assetOrKey)
        let count = M('data').achive[type][assetOrKey].count
        if (count > nextCount) {
            M('data').achive[type][assetOrKey].count = count - nextCount
        } else {
            M('data').achive[type][assetOrKey].count = 0
        }
        M('data').achive[type][assetOrKey].level += 1
        E.emit(this.eventType.INC_LEVEL, type, assetOrKey)
    }

    getDefDataVal(type, assetOrKey) {
        let defData
        if (type == 'useRole' || type == 'useSkill' || type == 'usePassiveSkill') {
            defData = this.defData[type]
        } else {
            defData = this.defData[type][assetOrKey]
        }
        return defData
    }

    getNextCount(type, assetOrKey) {
        let defDataVal = this.getDefDataVal(type, assetOrKey)
        let level = this.getLevel(type, assetOrKey)
        return H.num((level + 1) * defDataVal)
    }

    getCount(type, assetOrKey) {
        return  H.num(M('data').achive[type][assetOrKey].count)
    }

    getLevel(type, assetOrKey) {
        return H.num(M('data').achive[type][assetOrKey].level)
    }

    getReward(type, assetOrKey) {
        let level = this.getLevel(type, assetOrKey)
        if (level < 1) level = 1
        let res = {}
        res.prop = {}
        res.prop.gold = level * 2000
        return res
    }

    getTotal(type, assetOrKey) {
        return H.num(M('data').achive[type][assetOrKey].total)
    }

    getTopTip(type, assetOrKey) {
        let tip
        if (type == 'useRole' || type == 'useSkill') {
            tip = 'achiveInfo.' + type
        } else {
            tip = 'achiveInfo.' + type + '.' + assetOrKey
        }
        let level = H.numAbbr(this.getLevel(type, assetOrKey) + 1)

        let res = '[Lv' + level + L(tip) + '] ' + L('done')
        return res
    }

    isDone(type, assetOrKey) {
        let count = this.getCount(type, assetOrKey)
        let nextCount = this.getNextCount(type, assetOrKey)
        return count >= nextCount
    }

    isTip() {
        let res = false
        for (let type in M('data').achive) {
            for (let assetOrKey in M('data').achive[type]) {
                if (this.isDone(type, assetOrKey)) res = true
            }
        }
        return res
    }
}

