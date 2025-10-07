import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('equipModel')
export class equipModel {
    eventType = {
        ADD: 'equipModel.add',
        UP_LEVEL: 'equipModel.upLevel',
    }

    createData(param) {
        param = {...{
            uid: H.uid(),
            level: 0,
            type: '?',
            pos: '?',
            star: '?',
            rank: '?',
            attrs: null,
        }, ...param}

        if (param.type == '?') param.type = H.randNum(1, 3)
        if (param.pos == '?') param.pos = H.randArr(['arm', 'head', 'chest', 'foot'])
        if (param.star == '?') param.star = H.randNum(0, 5)
        if (param.rank == '?') {
            if (H.calProb(30)) {
                param.rank = H.randNum(1, 5)
            } else {
                param.rank = 0
            }
        }

        let res = {}
        res.uid = param.uid
        res.type = param.type
        res.pos = param.pos
        res.level = param.level
        res.star = param.star
        res.rank = param.rank
        if (param.attrs) {
            res.attrs = param.attrs
        } else if (res.rank > 0) {
            let attrs = M('role').getAttrs()
            let randAttr = H.randArr(attrs)
            let attr = {}
            attr.key = randAttr.key
            let min = res.rank - 1
            if (min < 0) min = 0
            attr.value = H.num(H.randNum(min, res.rank) + H.randNum(0.01, 1, true), 2)
            res.attrs = [attr]
        }

        const calVal = (baseVal) => {
            let val = baseVal
            val = val + param.star
            val = val + param.level
            return H.num(val)
        }

        if (res.pos == 'arm') {
            res.ATK = calVal(1)
        } else {
            res.HP = calVal(2)
        }
        return res
    }

    add(equipData) {
        let current = M('data').equips.filter(a => {
            return a.type === equipData.type && a.pos === equipData.pos
        })[0]
        if (current) {
            M('data').equips.forEach((a, index) => {
                if (a.type === equipData.type && a.pos === equipData.pos) {
                    M('data').equips.splice(index, 1, equipData)
                }
            })
        } else {
            M('data').equips.push(equipData)
        }
        E.emit(this.eventType.ADD)
    }

    preAdd() {
        let res = {}
        res.equipNum = 1
        res.error = {}
        if (M('data').prop.equipNum < res.equipNum) {
            res.error.equipNum = L('error_equipNum')
            return res
        }
        M('prop').setNum('equipNum', '-', res.equipNum)
        return res
    }

    calSell(equipData) {
        let gold = 100
        gold += equipData.level * 50
        const calVal = (val) => {
            val += val * (equipData.rank * 20) / 100
            val += val * (equipData.star * 20) / 100
            return val
        }
        let res = {}
        res.gold = calVal(gold)
        return res
    }

    calUpLevel(equipData, upNum = 1) {
        let res = {}
        res.gold = 0
		res.upNum = 0
        res.error = {}
        if (upNum < 1) return res

        if (equipData.level >= M('data').fight.level) {
            res.error.level = L('error_equip_level')
        }
        const cal = (level) => {
            let res = {}
            let baseVal = 5000
            let goldVal = baseVal * level
            if (goldVal < baseVal) goldVal = baseVal
            res.gold = goldVal
            return res
        }
        let level = equipData.level
		let num = upNum
		while (true) {
			if (upNum) {
				num--
        		if (num < 0) break
        	}
        	let calRes = cal(level)
            res.gold += calRes.gold
        	level++
        	res.upNum++
		}
        if (M('data').prop.gold < res.gold) {
            res.error.gold = L('error_gold')
        }
        return res
    }

    upLevel(equipData, upNum = 1) {
        let upRes = this.calUpLevel(equipData, upNum)
        if (H.isEmpty(upRes.error)) {
            M('prop').setNum('gold', '-', upRes.gold)
            let newData = {...equipData, ...{
                level: equipData.level + upNum
            }}
            newData = this.createData(newData)
            M('data').equips.forEach((a, index) => {
                if (a.uid == equipData.uid) {
                    M('data').equips.splice(index, 1, newData)
                }
            })
            E.emit(this.eventType.UP_LEVEL)
        }
        return upRes
    }

    getData(typeOrUid, pos) {
        if (!pos) {
            return M('data').equips.filter(a => {
                return a.uid == typeOrUid
            })[0]
        }
        return M('data').equips.filter(a => {
            return a.type == typeOrUid && a.pos == pos
        })[0]
    }

    getColor(equipData) {
        let color = '#CCCCCC'
        let val = equipData.rank
        if (val == 1) color = '#519CEE'
        if (val == 2) color = '#4AC74A'
        if (val == 3) color = '#D43FD1'
        if (val == 4) color = '#FFA300'
        if (val == 5) color = '#ED1C24'
        return color
    }

    checkSetting(equipData) {
        let setting = M('data').setting.openEquip
        if (setting.rank != '*') {
            if (equipData.rank < H.num(setting.rank)) return false
        }
        if (setting.star != '*') {
            if (equipData.star < H.num(setting.star)) return false
        }
        return true
    }

    isTip() {
        return M('data').prop.equipNum > 0
    }
}

