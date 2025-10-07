import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('gameModel')
export class gameModel {
    eventType = {
        SET_REWARD: 'gameModel.setReward'
    }

    getSidReward(isReal = false) {
        let res = {}
        res.prop = {}
        res.prop.gold = 10000 * M('data').fight.level
        res.prop.equipNum = 20
        res.chips = [
            {
                type: 'role',
                asset: '?',
                chip: 20 * M('data').fight.level,
            },
            {
                type: 'skill',
                asset: '?',
                chip: 20 * M('data').fight.level,
            },
        ]
        return isReal ? this.getRealReward(res) : res
    }

    getBoxReward(isReal = false) {
        let defData = M('data').getDefData()
        let res = {}
        res.cd = defData.timeCount.adBox
        res.prop = {}
        res.prop.gold = 2000 * M('data').fight.level
        res.prop.equipNum = 5
        res.chips = [
            {
                type: 'role',
                asset: '?',
                chip: 5 * M('data').fight.level,
            },
            {
                type: 'skill',
                asset: '?',
                chip: 5 * M('data').fight.level,
            },
        ]
        return isReal ? this.getRealReward(res) : res
    }

    getRealReward(reward) {
        reward.chips.forEach(chip => {
            if (chip.asset == '?') {
                if (chip.type == 'role') {
                    let baseDatas = M('role').getPlayerBaseDatas()
                    let baseData = H.randArr(baseDatas)
                    chip.asset = baseData.asset
                }
                if (chip.type == 'skill') {
                    let baseDatas = M('skill').getBaseDatas()
                    let baseData = H.randArr(baseDatas)
                    chip.asset = baseData.name
                }
            }
        })
        return reward
    }

    setReward(reward) {
        if (reward.prop) {
            for (let key in reward.prop) {
                M('prop').setNum(key, '+', reward.prop[key])
            }
        }
        if (reward.chips) {
            reward.chips.forEach(chip => {
                if (chip.type == 'role') {
                    M('role').setChip(chip.asset, '+', chip.chip)
                }
                if (chip.type == 'skill') {
                    M('skill').setChip(chip.asset, '+', chip.chip)
                }
            })
        }
        E.emit(this.eventType.SET_REWARD)
    }
}

