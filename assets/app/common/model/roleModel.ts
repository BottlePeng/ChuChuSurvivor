import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('roleModel')
export class roleModel {
    eventType = {
        ADD: 'roleModel.add#asset',
        UP_LEVEL: 'roleModel.upLevel#asset',
        SELECT: 'roleModel.setSelect#asset',
        SET_CHIP: 'roleModel.setChip#asset',
    }

    // 玩家角色数据
    createPlayerData(asset) {
        let selectRoleData = M('data').roles.filter(a => {
            return a.asset == asset
        })[0]
        let res = {}
        res.HP = 10 + (selectRoleData.HPLevel * 5) // 血量 基础10 每级+5
        res.ATK = 10 + selectRoleData.ATKLevel // 攻击 基础10 每级+2
        for (let key in M('data').skill) {
            res[key] = M('data').skill[key]
        }
        for (let key in res) {
            res[key] = H.num(res[key])
        }
        this.getAttrs().forEach(attr => {
            res[attr.key] = 0
        })
        if (!selectRoleData.selected) return res

        let helpData = this.getHelpData()
        res.HP += helpData.HP
        res.ATK += helpData.ATK

        M('data').equips.forEach(a => {
            if ('HP' in a) res.HP += a.HP
            if ('ATK' in a) res.ATK += a.ATK
            if (a.attrs) {
                a.attrs.forEach(attr => {
                    if (attr.key == 'HPPencent') res.HP += H.num(res.HP * (attr.value / 100))
                    if (attr.key == 'ATKPencent') res.ATK += H.num(res.ATK * (attr.value / 100))
                    res[attr.key] += attr.value
                    res[attr.key] = H.num(res[attr.key], 2)
                })
            }
        })
        return res
    }

    getHelpData(type) {
        let res = {}
        res.HP = 0
        res.ATK = 0

        let levelCount = 0
        const calRole = () => {
            M('data').roles.filter(a => {
                return !a.selected
            }).forEach(a => {
                let HPLevel = a.HPLevel + 1
                let ATKLevel = a.ATKLevel + 1
                levelCount += HPLevel
                levelCount += ATKLevel
            })
        }
        let skillLevelCount = 0
        const calSkill = () => {
            for (let key in M('data').skill) {
                skillLevelCount += M('data').skill[key]
            }
        }

        if (!type) {
            calRole()
            calSkill()
        } else {
            if (type == 'role') {
                calRole()
            }
            if (type == 'skill') {
                calSkill()
            }
        }
        levelCount = H.num(levelCount)

        for (let level = 1; level <= levelCount; level++) {
            if ((level % 2) == 0) {
                res.ATK += 1
            } else {
                res.HP += 2
            }
        }
        for (let level = 1; level <= skillLevelCount; level++) {
            if ((level % 2) == 0) {
                res.ATK += 0.5
            } else {
                res.HP += 1
            }
        }
        res.HP = H.num(res.HP)
        res.ATK = H.num(res.ATK)
        return res
    }

    getAllUpDatas(upType) {
        let levelCount = 0
        let arr = []
        M('data').roles.filter(a => {
            let calRes = this.calUpLevel(a.asset, upType, 1)
            return H.isEmpty(calRes.error)
        }).forEach(a => {
            let level = a[upType + 'Level']
            levelCount += level
            arr.push({
                asset: a.asset,
                level: level
            })
        })
        let sum = H.num(levelCount / arr.length)
        arr = arr.filter(a => {
            return a.level <= sum
        }).sort((a, b) => {
            return a.level - b.level
        })
        return arr
    }

    calUpLevel(asset, upType = 'ATK', upNum = 1) {
        let res = {}
		res.chip = 0
        res.gold = 0
		res.upNum = 0
        res.error = {}
        if (upNum < 1) return res

        const cal = (level) => {
            let res = {}
            let chipVal = 0
            let goldVal = 0
            if (upType == 'ATK') {
                chipVal = 2
                goldVal = 500
            } else {
                chipVal = 1
                goldVal = 400
            }
            res.chip = chipVal + (level * chipVal)
            res.gold = goldVal + (level * goldVal)
            return res
        }

        let roleData = this.getPlayerData(asset)
        let level = roleData[upType + 'Level']
		let num = upNum
		while (true) {
			if (upNum) {
				num--
        		if (num < 0) break
        	}
        	let calRes = cal(level)
        	res.chip += calRes.chip
            res.gold += calRes.gold
        	level++
        	res.upNum++
		}
        if (this.getChip(asset) < res.chip) {
            res.error.chip = L('error_chip')
        }
        if (M('data').prop.gold < res.gold) {
            res.error.gold = L('error_gold')
        }
        return res
    }

    upLevel(asset, upType = 'ATK', upNum = 1) {
        let upRes = this.calUpLevel(asset, upType, upNum)
        if (H.isEmpty(upRes.error)) {
            this.setChip(asset, '-', upRes.chip)
            M('prop').setNum('gold', '-', upRes.gold)
            let roleData = this.getPlayerData(asset)
            roleData[upType + 'Level'] += upRes.upNum
            E.emit(this.eventType.UP_LEVEL, asset)
        }
        return upRes
    }

    calAdd(asset) {
        let res = {}
        res.chip = 0
        res.gold = 0
        res.error = {}
        let roleData = M('data').roles.filter(a => {
            return a.asset == asset
        })[0]
        if (roleData) {
            res.error.has = L('error_has_role')
        }

        let baseData = this.getPlayerBaseData(asset)
        if (!baseData) {
            res.error.chip = L('error_role')
        }

        res.chip = 50 * (baseData.mul - 1)
        if (res.chip < 50) res.chip = 50
        res.gold = 5000 * (baseData.mul - 1)
        if (res.gold < 5000) res.gold = 5000


        if (this.getChip(asset) < res.chip) {
            res.error.chip = L('error_chip')
        }
        if (M('data').prop.gold < res.gold) {
            res.error.gold = L('error_gold')
        }
        return res
    }

    add(asset) {
        let addRes = this.calAdd(asset)
        if (H.isEmpty(addRes.error)) {
            this.setChip(asset, '-', addRes.chip)
            M('prop').setNum('gold', '-', addRes.gold)
            M('data').roles.push({
                asset: asset,
                ATKLevel: 0,
                HPLevel: 0,
            })
            E.emit(this.eventType.ADD, asset)
        }
        return addRes
    }

    isTip(type, upType = 'ATK') {
        let bool = false
        if (type == 'add') {
            this.getPlayerBaseDatas().forEach(a => {
                let checkHas = M('data').roles.filter(b => {
                    return b.asset == a.asset
                })[0]
                if (!checkHas) {
                    let res = this.calAdd(a.asset)
                    if (H.isEmpty(res.error)) bool = true
                }
            })
        }
        if (type == 'upLevel') {
            M('data').roles.forEach(a => {
                if (type == 'upLevel') {
                    let res = this.calUpLevel(a.asset, upType, 1)
                    if (H.isEmpty(res.error)) bool = true
                }
            })
        }
        return bool
    }

    createEnemyData(param) {
        param = {...{
            level: 0,
            bossLevel: 0,
            calPercent: 100,
            calHPPercent: 100,
        }, ...param}
        let mul = param.calPercent / 100
        let HPmul = param.calHPPercent / 100
        let res = {}
        res.HP = (100 * param.level) * HPmul
        if (res.HP < 10) res.HP = 10
        if (param.bossLevel) res.HP = (res.HP * 50) * param.bossLevel

        res.ATK = (2 * param.level) * mul
        if (res.ATK < 1) res.ATK = 1
        if (param.bossLevel) res.ATK = (res.ATK * 2) * param.bossLevel

        res.bossLevel = param.bossLevel

        for (let key in res) {
            res[key] = H.num(res[key])
        }
        return res
    }

    setSelect(asset) {
        let roleData = this.getPlayerData(asset)
        if (roleData.selected) return
        M('data').roles.forEach(a => {
            delete a.selected
        })
        roleData.selected = true
        E.emit(this.eventType.SELECT, asset)
    }

    setChip(asset, action = '+', val) {
        M('data').setChip('role', asset, action, val)
        E.emit(this.eventType.SET_CHIP, asset)
    }

    getAttrs(type = '*') {
        let res = []
        if (type == '*' || type == 'base') {
            res.push({
                name: L('HPPencent'),
                key: 'HPPencent',
            })
            res.push({
                name: L('ATKPencent'),
                key: 'ATKPencent',
            })

            res.push({
                name: L('critOdds'),
                key: 'critOdds',
            })
            res.push({
                name: L('doubleOdds'),
                key: 'doubleOdds',
            })
        }
        if (type == '*' || type == 'skill') {
            M('skill').getBaseDatas().forEach(a => {
                res.push({
                    asset: a.name,
                    name: L('skillInfo.' + a.name + '.title'),
                    key: a.name + 'Pencent',
                })
            })
        }
        return res
    }

    getChip(asset) {
        let chip = M('data').chip.role[asset]
        return H.num(chip)
    }

    getChipColor() {
        return '#FFAA00'
    }

    getPlayerData(asset) {
        return M('data').roles.filter(a => {
            return a.asset == asset
        })[0]
    }

    getPlayerBaseData(asset) {
        let playerBaseDatas = this.getPlayerBaseDatas()
        return playerBaseDatas.filter(a => {
            return a.asset == asset
        })[0]
    }

    getPlayerBaseDatas() {
        let res = []
        res.push({
            asset: 'allianceGuard',
            skillName: 'sword',
        })
        res.push({
            asset: 'orcWarrior',
            skillName: 'knive',
        })
        res.push({
            asset: 'hordeGrunt',
            skillName: 'dart',
        })
        res.push({
            asset: 'trollMage',
            skillName: 'fireBall',
        })
        res.push({
            asset: 'dwarfShaman',
            skillName: 'bomb',
        })
        res.push({
            asset: 'humanMage',
            skillName: 'hole',
        })
        res.push({
            asset: 'orcShaman',
            skillName: 'boomerang',
        })
        res.push({
            asset: 'trollHunter',
            skillName: 'ice',
        })
        res.push({
            asset: 'taurenDruid',
            skillName: 'stony',
        })
        res.push({
            asset: 'undeadWarlock',
            skillName: 'drug',
        })
        res.push({
            asset: 'undeadRogue',
            skillName: 'lightning',
        })
        res.push({
            asset: 'dwarfPriest',
            skillName: 'magicBall',
        })
        res.push({
            asset: 'gnome',
            skillName: 'gem',
        })
        res.push({
            asset: 'humanPaladin',
            skillName: 'laser',
        })
        res.push({
            asset: 'quilboarWarrior',
            skillName: 'tornado',
        })
        res.forEach((a, index) => {
            a.mul = index + 1
        })
        return res
    }

    getGroupAssets() {
        return ['bat', 'blackVulture']
    }

    getNearAssets() {
        return ['bat', 'boar', 'sheep', 'wolf', 'greenMurloc', 'orangeCrab', 'darkScorpion', 'redRaptor', 'lion', 'blackVulture']
    }

    getRangeAssets() {
        return ['succubus', 'voidwalker', 'felhound']
    }

    getAssets() {
        return [...this.getGroupAssets(), ...this.getNearAssets(), ...this.getRangeAssets()]
    }
}

