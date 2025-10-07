import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('skillModel')
export class skillModel {
    eventType = {
        SET_CHIP: 'skillModel.setChip#asset',
        UP_LEVEL: 'skillModel.upLevel#asset',
    }

    assets = []

    createData(param) {
        param = {...{
            name: '',
            level: 1,
            hurtPercent: 0,
        }, ...param}

        let data = {}
        if (param.name == 'fireBall') {
            data.hurtPercent = 100
            data.asset = 'fireBall'
            data.scale = 1
            data.angle = 10
            data.num = 1
            data.speed = 400
            data.cd = 3
            data.pierce = 3
            data.isRandTarget = false
            if (param.level > 1) data.num = 2
            if (param.level > 2) data.cd = 2
            if (param.level > 3) data.num = 3
            if (param.level > 4) {
                data.scale = 2
                data.hurtPercent = 150
            }
            if (param.level > 5) data.num = 4
            if (param.level > 6) data.cd = 1
            if (param.level > 7) data.num = 5
            if (param.level > 8) data.pierce = false
            if (param.level > 9) {
                data.asset = 'fireBall2'
                data.scale = 4
                data.cd = 0.5
                data.num = 2
                data.isRandTarget = true
            }
        }
        if (param.name == 'stony') {
            data.hurtPercent = 100
            data.asset = 'stony'
            data.num = 3
            data.cd = 3
            data.radius = 100
            data.roundTime = 2
            data.scale = 1
            if (param.level > 1) data.num = 4
            if (param.level > 2) data.cd = 2
            if (param.level > 3) data.radius = 150
            if (param.level > 4) data.roundTime = 1.5
            if (param.level > 5) data.num = 5
            if (param.level > 6) data.cd = 1
            if (param.level > 7) data.radius = 200
            if (param.level > 8) data.roundTime = 1
            if (param.level > 9) {
                data.hurtPercent = 150
                data.asset = 'stony2'
                data.cd = 0
                data.roundTime = 1
                data.scale = 1.2
            }
        }
        if (param.name == 'dart') {
            data.hurtPercent = 100
            data.asset = 'dart'
            data.isRound = false
            data.angle = 10
            data.num = 3
            data.speed = 600
            data.cd = 3
            data.scale = 1
            data.pierce = 1
            if (param.level > 1) {
                data.angle = 15
                data.num = 5
            }
            if (param.level > 2) data.cd = 2
            if (param.level > 3) data.pierce = 2
            if (param.level > 4) {
                data.angle = 20
                data.num = 7
            }
            if (param.level > 5) {
                data.scale = 1.5
                data.cd = 1
            }
            if (param.level > 6) data.pierce = 3
            if (param.level > 7) {
                data.isRound = true
                data.angle = 20
            }
            if (param.level > 8) {
                data.angle = 15
                data.pierce = 4
            }
            if (param.level > 9) {
                data.cd = 1.5
                data.hurtPercent = 150
                data.asset = 'dart2'
                data.angle = 25
                data.scale = 2
                data.pierce = false
            }
        }
        if (param.name == 'drug') {
            data.hurtPercent = 50
            data.asset = 'drug'
            data.cd = 3
            data.num = 1
            data.scale = 1
            data.timeout = 3
            if (param.level > 1) data.num = 2
            if (param.level > 2) data.cd = 2
            if (param.level > 3) data.scale = 1.5
            if (param.level > 4) data.timeout = 5
            if (param.level > 5) data.num = 3
            if (param.level > 5) data.cd = 1
            if (param.level > 6) data.scale = 2
            if (param.level > 7) data.num = 4
            if (param.level > 8) data.num = 5
            if (param.level > 9) {
                data.asset = 'drug2'
                data.num = 6
                data.hurtPercent = 80
            }
        }
        if (param.name == 'hole') {
            data.hurtPercent = 50
            data.asset = 'hole'
            data.scale = 1
            data.hurtCd = 0.5
            if (param.level > 1) data.scale = 1.5
            if (param.level > 2) data.hurtPercent = 60
            if (param.level > 3) data.scale = 2
            if (param.level > 4) data.hurtPercent = 70
            if (param.level > 5) data.scale = 2.5
            if (param.level > 6) data.hurtPercent = 80
            if (param.level > 7) data.scale = 3
            if (param.level > 8) data.hurtPercent = 90
            if (param.level > 9) {
                data.asset = 'hole2'
                data.hurtPercent = 100
            }
        }
        if (param.name == 'sword') {
            data.hurtPercent = 150
            data.asset = 'sword'
            data.scale = 1
            data.cd = 4
            data.num = 1
            data.roundNum = 1
            if (param.level > 1) data.scale = 1.5
            if (param.level > 2) data.cd = 3
            if (param.level > 3) data.num = 2
            if (param.level > 4) data.roundNum = 2
            if (param.level > 5) data.scale = 2
            if (param.level > 6) data.hurtPercent = 165
            if (param.level > 7) data.num = 3
            if (param.level > 8) data.hurtPercent = 180
            if (param.level > 9) {
                data.asset = 'sword2'
                data.hurtPercent = 200
                data.scale = 1.5
                data.num = 3
                data.cd = 2
                data.roundNum = 3
            }
        }
        if (param.name == 'magicBall') {
            data.hurtPercent = 100
            data.asset = 'magicBall'
            data.scale = 1
            data.speed = 600
            data.cd = 1
            data.pierce = 1
            if (param.level > 1) data.cd = 0.9
            if (param.level > 2) data.cd = 0.8
            if (param.level > 3) data.cd = 0.7
            if (param.level > 4) data.cd = 0.6
            if (param.level > 5) data.cd = 0.5
            if (param.level > 6) data.cd = 0.4
            if (param.level > 7) data.cd = 0.3
            if (param.level > 8) data.cd = 0.2
            if (param.level > 9) {
                data.asset = 'magicBall2'
                data.hurtPercent = 150
                data.speed = 800
                data.cd = 0.05
            }
        }
        if (param.name == 'lightning') {
            data.hurtPercent = 100
            data.asset = 'lightning'
            data.cd = 3
            data.scale = 1
            data.num = 1
            if (param.level > 1) data.num = 2
            if (param.level > 2) data.num = 3
            if (param.level > 3) {
                data.cd = 2
                data.num = 4
            }
            if (param.level > 4) data.num = 5
            if (param.level > 5) data.num = 6
            if (param.level > 6) data.num = 7
            if (param.level > 7) data.num = 8
            if (param.level > 8) data.num = 9
            if (param.level > 9) {
                data.asset = 'lightning2'
                data.hurtPercent = 150
                data.scale = 1.5
                data.num = 10
            }
        }
        if (param.name == 'boomerang') {
            data.hurtPercent = 50
            data.asset = 'boomerang'
            data.cd = 3
            data.scale = 1
            data.num = 1
            if (param.level > 1) data.num = 2
            if (param.level > 2) {
                data.hurtPercent = 60
                data.num = 3
            }
            if (param.level > 3) {
                data.num = 4
                data.cd = 1.5
            }
            if (param.level > 4) {
                data.hurtPercent = 70
                data.num = 5
            }
            if (param.level > 5) {
                data.hurtPercent = 80
                data.scale = 1.5
                data.num = 6
            }
            if (param.level > 6) data.num = 7
            if (param.level > 7) data.num = 8
            if (param.level > 8) data.num = 9
            if (param.level > 9) {
                data.hurtPercent = 100
                data.asset = 'boomerang2'
                data.num = 10
                data.scale = 3
                data.cd = 1
            }
        }
        if (param.name == 'bomb') {
            data.hurtPercent = 100
            data.asset = 'bomb'
            data.cd = 3
            data.scale = 1
            data.boomScale = 1
            data.num = 1
            data.speed = 500
            if (param.level > 1) data.num = 2
            if (param.level > 2) {
                data.hurtPercent = 110
                data.num = 3
            }
            if (param.level > 3) {
                data.num = 4
                data.cd = 2
            }
            if (param.level > 4) {
                data.hurtPercent = 120
                data.num = 5
            }
            if (param.level > 5) {
                data.hurtPercent = 130
                data.scale = 1.5
                data.num = 6
            }
            if (param.level > 6) data.num = 7
            if (param.level > 7) data.num = 8
            if (param.level > 8) data.num = 9
            if (param.level > 9) {
                data.hurtPercent = 150
                data.asset = 'bomb2'
                data.num = 10
                data.scale = 1.5
                data.boomScale = 2
                data.speed = 600
            }
        }
        if (param.name == 'ice') {
            data.hurtPercent = 100
            data.asset = 'ice'
            data.scale = 1
            data.num = 1
            data.speed = 800
            data.cd = 3
            data.pierce = 1
            data.freezeCd = 2
            data.freezeScale = 1
            if (param.level > 1) data.num = 2
            if (param.level > 2) data.cd = 2
            if (param.level > 3) data.num = 3
            if (param.level > 4) {
                data.scale = 1.5
                data.hurtPercent = 110
                data.pierce = 2
            }
            if (param.level > 5) data.num = 4
            if (param.level > 6) data.num = 5
            if (param.level > 7) data.pierce = 3
            if (param.level > 8) data.pierce = 4
            if (param.level > 9) {
                data.asset = 'ice2'
                data.cd = 1.5
                data.hurtPercent = 150
                data.speed = 1000
                data.pierce = false
                data.freezeCd = 3
                data.freezeScale = 1.5
            }
        }
        if (param.name == 'knive') {
            data.hurtPercent = 100
            data.asset = 'knive'
            data.scale = 1
            data.num = 1
            data.speed = 500
            data.cd = 3
            if (param.level > 1) data.num = 2
            if (param.level > 2) data.cd = 2
            if (param.level > 3) data.hurtPercent = 110
            if (param.level > 4) data.scale = 1.5
            if (param.level > 5) data.scale = 2
            if (param.level > 6) data.speed = 700
            if (param.level > 7) data.hurtPercent = 120
            if (param.level > 8) data.hurtPercent = 130
            if (param.level > 9) {
                data.hurtPercent = 150
                data.asset = 'knive2'
                data.scale = 3
                data.num = 3
                data.cd = 1.5
            }
        }
        if (param.name == 'gem') {
            data.hurtPercent = 50
            data.asset = 'gem'
            data.scale = 1
            data.num = 1
            data.speed = 1000
            data.cd = 5
            data.timeout = 5
            if (param.level > 1) data.num = 2
            if (param.level > 2) data.hurtPercent = 60
            if (param.level > 3) data.num = 3
            if (param.level > 4) data.hurtPercent = 70
            if (param.level > 5) data.num = 4
            if (param.level > 6) data.hurtPercent = 80
            if (param.level > 7) data.num = 5
            if (param.level > 8) data.hurtPercent = 90
            if (param.level > 9) {
                data.hurtPercent = 100
                data.asset = 'gem2'
                data.cd = 3
            }
        }
        if (param.name == 'laser') {
            data.hurtPercent = 50
            data.asset = 'laser'
            data.cd = 3
            data.num = 1
            data.scale = 1
            data.timeout = 3
            if (param.level > 1) data.num = 2
            if (param.level > 2) data.cd = 2
            if (param.level > 3) data.num = 3
            if (param.level > 4) data.scale = 2
            if (param.level > 5) data.hurtPercent = 60
            if (param.level > 6) data.num = 4
            if (param.level > 7) data.num = 5
            if (param.level > 8) data.scale = 5
            if (param.level > 9) {
                data.num = 6
                data.timeout = 5
                data.asset = 'laser2'
                data.cd = 1.5
                data.hurtPercent = 80
            }
        }
        if (param.name == 'tornado') {
            data.hurtPercent = 80
            data.asset = 'tornado'
            data.cd = 5
            data.num = 1
            data.scale = 2
            data.timeout = 10
            data.speed = 200
            if (param.level > 1) data.num = 2
            if (param.level > 2) data.cd = 3
            if (param.level > 3) {
                data.hurtPercent = 100
                data.speed = 250
            }
            if (param.level > 4) data.scale = 2.5
            if (param.level > 5) data.hurtPercent = 120
            if (param.level > 6) {
                data.num = 3
                data.speed = 300
            }
            if (param.level > 7) data.scale = 3
            if (param.level > 8) data.num = 4
            if (param.level > 9) {
                data.asset = 'tornado2'
                data.hurtPercent = 150
                data.num = 5
                data.cd = 2.5
                data.scale = 4
            }
        }

        data.hurtPercent = data.hurtPercent + param.hurtPercent
        return data
    }

    getAllUpDatas() {
        let levelCount = 0
        let arr = []
        this.getBaseDatas().filter(a => {
            let calRes = this.calUpLevel(a.name, 1)
            return H.isEmpty(calRes.error)
        }).forEach(a => {
            let level = this.getLevel(a.name)
            levelCount += level
            arr.push({
                asset: a.name,
                level: level,
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

    getBaseDatas() {
        let res = []
        res.push({
            name: 'fireBall',
            title: L('skillInfo.fireBall.title'),
            des: L('skillInfo.fireBall.des'),
        })
        res.push({
            name: 'stony',
            title: L('skillInfo.stony.title'),
            des: L('skillInfo.stony.des'),
        })
        res.push({
            name: 'dart',
            title: L('skillInfo.dart.title'),
            des: L('skillInfo.dart.des'),
        })
        res.push({
            name: 'drug',
            title: L('skillInfo.drug.title'),
            des: L('skillInfo.drug.des'),
        })
        res.push({
            name: 'sword',
            title: L('skillInfo.sword.title'),
            des: L('skillInfo.sword.des'),
        })
        res.push({
            name: 'hole',
            title: L('skillInfo.hole.title'),
            des: L('skillInfo.hole.des'),
        })
        res.push({
            name: 'magicBall',
            title: L('skillInfo.magicBall.title'),
            des: L('skillInfo.magicBall.des'),
        })
        res.push({
            name: 'lightning',
            title: L('skillInfo.lightning.title'),
            des: L('skillInfo.lightning.des'),
        })
        res.push({
            name: 'boomerang',
            title: L('skillInfo.boomerang.title'),
            des: L('skillInfo.boomerang.des'),
        })
        res.push({
            name: 'bomb',
            title: L('skillInfo.bomb.title'),
            des: L('skillInfo.bomb.des'),
        })
        res.push({
            name: 'ice',
            title: L('skillInfo.ice.title'),
            des: L('skillInfo.ice.des'),
        })
        res.push({
            name: 'knive',
            title: L('skillInfo.knive.title'),
            des: L('skillInfo.knive.des'),
        })
        res.push({
            name: 'gem',
            title: L('skillInfo.gem.title'),
            des: L('skillInfo.gem.des'),
        })
        res.push({
            name: 'laser',
            title: L('skillInfo.laser.title'),
            des: L('skillInfo.laser.des'),
        })
        res.push({
            name: 'tornado',
            title: L('skillInfo.tornado.title'),
            des: L('skillInfo.tornado.des'),
        })

        let banNames = []
        let arr = []
        M('role').getPlayerBaseDatas().forEach(a => {
            let skillData = res.filter(b => {
                return b.name == a.skillName
            })[0]
            if (skillData) {
                arr.push(skillData)
                banNames.push(skillData.name)
            }
        })
        arr = arr.concat(res.filter(a => {
            return !banNames.includes(a.name)
        }))
        return arr
    }

    getPassiveBaseDatas() {
        let res = []
        res.push({
            name: 'propRadius',
            title: L('passiveSkillInfo.propRadius.title')
        })
        res.push({
            name: 'ATK',
            title: L('passiveSkillInfo.ATK.title'),
            pencent: 5
        })
        res.push({
            name: 'HP',
            title: L('passiveSkillInfo.HP.title'),
            pencent: 10
        })
        res.push({
            name: 'SPD',
            title: L('passiveSkillInfo.SPD.title')
        })
        return res
    }

    getAssets() {
        if (this.assets.length > 0) return this.assets
        let baseDatas = this.getBaseDatas()
        let assets = []
        H.forArr(baseDatas, baseData => {
            assets.push(baseData.name)
        })
        this.assets = assets
        return assets
    }

    getMaxNum(type) {
        if (type == 'passive') return 2
        return 5
    }

    setChip(asset, action = '+', val) {
        M('data').setChip('skill', asset, action, val)
        E.emit(this.eventType.SET_CHIP, asset)
    }

    getChip(asset) {
        let chip = M('data').chip.skill[asset]
        return H.num(chip)
    }

    getChipColor() {
        return '#00FFFF'
    }

    calUpLevel(asset, upNum = 1) {
        let res = {}
		res.chip = 0
        res.gold = 0
		res.upNum = 0
        res.error = {}
        if (upNum < 1) return res

        const cal = (level) => {
            let res = {}
            let chipVal = 2
            let goldVal = 500
            res.chip = chipVal + (level * chipVal)
            res.gold = goldVal + (level * goldVal)
            return res
        }

        let level = H.num(M('data').skill[asset + 'Level'])
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

    getLevel(asset) {
        return H.num(M('data').skill[asset + 'Level'])
    }

    upLevel(asset, upNum = 1) {
        let calRes = this.calUpLevel(asset, upNum)
        if (H.isEmpty(calRes.error)) {
            this.setChip(asset, '-', calRes.chip)
            M('prop').setNum('gold', '-', calRes.gold)
            let skillKey = asset + 'Level'
            if (!(skillKey in M('data').skill)) M('data').skill[skillKey] = 0
            M('data').skill[skillKey] += calRes.upNum
            E.emit(this.eventType.UP_LEVEL, asset)
        }
        return calRes
    }

    isTip() {
        let bool = false
        this.getBaseDatas().forEach(a => {
            let res = this.calUpLevel(a.name, 1)
            if (H.isEmpty(res.error)) bool = true
        })
        return bool
    }
}

