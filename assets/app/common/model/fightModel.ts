import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('fightModel')
export class fightModel {
    eventType = {
        SET_SELECT_LEVEL: 'fightModel.setSelectLevel'
    }

    init() {
        this.level = 1
        this.revive = 1
        this.kill = 0

        this.reward = {}
        this.reward.isDouble = false
        this.reward.prop = {}
        this.reward.prop.gold = 0
        this.reward.prop.equipNum = 0
        this.reward.chips = []

        this.player = {}
        this.player.asset = ''
        this.player.level = 1
        this.player.exp = 0
        this.player.nextExp = this.calNextLevelExp(this.player.level)
        this.player.skill = {} //level,hurt
        this.player.passiveSkill = {} //level

        this.second = 0
        this.maxSecond = 900
        this.stop = false
        this.isInit = true
    }

    setSkillNum(name, key, val, action = '=') {
        let assets = M('skill').getAssets()
        if (!assets.includes(name)) return
        if (!this.player.skill[name]) {
            this.player.skill[name] = {}
            this.player.skill[name].level = 0
            this.player.skill[name].hurt = 0
            this.player.skill[name].second = this.second
        }
        if (action == '+') {
            this.player.skill[name][key] += val
        } else if (action == '-') {
            this.player.skill[name][key] -= val
        } else {
            this.player.skill[name][key] = val
        }
    }

    setPassiveSkillNum(name, key, val, action = '=') {
        let baseData = M('skill').getPassiveBaseDatas().filter(a => {
            return a.name == name
        })[0]
        if (!baseData) return

        if (!this.player.passiveSkill[name]) {
            this.player.passiveSkill[name] = {}
            this.player.passiveSkill[name].level = 0
            if ('pencent' in baseData) this.player.passiveSkill[name].pencent = baseData.pencent
        }
        if (action == '+') {
            this.player.passiveSkill[name][key] += val
        } else if (action == '-') {
            this.player.passiveSkill[name][key] -= val
        } else {
            this.player.passiveSkill[name][key] = val
        }
    }

    upLevel() {
        this.player.level += 1
        this.player.exp = 0
        this.player.nextExp = this.calNextLevelExp(this.player.level)
    }

    calNextLevelExp(curLevel) {
        return curLevel * 10
    }

    setSelectLevel(action = '+', val = 1) {
        val = H.num(val)
        if (action == '+') M('data').fight.selectLevel += val
        if (action == '-') M('data').fight.selectLevel -= val
        if (action == '=') M('data').fight.selectLevel = val
        if (M('data').fight.selectLevel > M('data').fight.level) M('data').fight.selectLevel = M('data').fight.level
        if (M('data').fight.selectLevel < 1) M('data').fight.selectLevel = 1
        E.emit(this.eventType.SET_SELECT_LEVEL)
    }

    getSkills(isHave = false) {
        let res = []
        if (isHave) {
            Object.keys(this.player.skill).forEach(name => {
                let data = {}
                data.name = name
                data.level = 0
                if (name in this.player.skill) {
                    data.level = this.player.skill[name].level
                }
                res.push(data)
            })
            Object.keys(this.player.passiveSkill).forEach(name => {
                let data = {}
                data.isPassive = true
                data.name = name
                data.level = 0
                if (name == 'HP' || name == 'ATK') {
                    data.pencent = this.player.passiveSkill[name].pencent
                }
                if (name in this.player.passiveSkill) {
                    data.level = this.player.passiveSkill[name].level
                }
                res.push(data)
            })
            return res
        }
        let skillDatas = M('skill').getBaseDatas()
        skillDatas.forEach(a => {
            let data = {}
            data.name = a.name
            data.level = 0
            if (a.name in this.player.skill) {
                data.level = this.player.skill[a.name].level
            }
            res.push(data)
        })

        let passiveSkillDatas = M('skill').getPassiveBaseDatas()
        passiveSkillDatas.forEach(a => {
            let data = {}
            data.isPassive = true
            data.name = a.name
            data.level = 0
            if (a.name == 'HP' || a.name == 'ATK') {
                data.pencent = a.pencent
            }
            if (a.name in this.player.passiveSkill) {
                data.level = this.player.passiveSkill[a.name].level
            }
            res.push(data)
        })

        return res
    }

    getRewardChipAssets(level) {
        let roleData = H.indexArr(M('role').getPlayerBaseDatas(), level - 1)
        let res = [
            {
                type: 'role',
                asset: roleData.asset
            },
            {
                type: 'skill',
                asset: roleData.skillName
            },
        ]
        return res
    }

    addRewardChip(type) {
        let chipAssets = this.getRewardChipAssets(this.level)
        let addNum = H.num(this.level / 2)
        if (addNum < 1) addNum = 1
        const add = (asset) => {
            let chip = this.reward.chips.find(a => a.type == type && a.asset == asset)
            if (chip) {
                chip.chip += addNum
            } else {
                this.reward.chips.push({
                    type: type,
                    asset: asset,
                    chip: addNum
                })
            }
        }
        chipAssets.filter(a => {
            return a.type == type
        }).forEach(a => {
            add(a.asset)
            M(type).setChip(a.asset, '+', addNum)
        })
    }

    addRewardPropNum(asset, addNum) {
        if (!addNum) addNum = this.level
        this.reward.prop[asset] += addNum
        M('prop').setNum(asset, '+', addNum)
        M('achive').incCount('gainProp', asset, addNum)
    }
}

