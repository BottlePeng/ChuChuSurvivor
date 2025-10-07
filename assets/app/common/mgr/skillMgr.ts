import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('skillMgr')
export class skillMgr {
    eventType = {
        SET_LEVEL: 'skillMgr.level',
        SET_PASSIVE_LEVEL: 'skillMgr.passiveLevel',
    }

    init(param) {
        param = {...{
            parent1Node: null,
            parent2Node: null,
        }, ...param}
        for (let key in param) this[key] = param[key]
    }

    checkRole(role) {
        if (!role) return false
        if (role.data.HP <= 0) return false
        if (role.state.cd.sleep > 0) return
        if (role.target) {
            if (role.target.group == 'player') {
                if (role.target.data.HP <= 0) return false
            }
        }
        return true
    }

    set(role, skillName, level = 1) {
        if (!role) return
        if (role.state.lose) return
        if (!role.skills) role.skills = []
        if (level === null) {
            let skill = role.skills.find(a => a.skillName == skillName)
            if (skill.remove) skill.remove()
            if (skill.removeAll) skill.removeAll()
            role.node.removeComponent(skill)
            role.skills = role.skills.filter(a => {
                return a.skillName != skillName
            })
            return
        }
        if (role[skillName]) {
            role[skillName].initData(M('skill').createData({
                name: skillName,
                level: level,
            }))
        } else {
            const addSkill = (comp) => {
                role[skillName] = H.add$(role.node, comp)
                role[skillName].init(role, skillName)
                role[skillName].initData(M('skill').createData({
                    name: skillName,
                    level: level,
                }))
                role.skills.push(role[skillName])
            }
            let bulletSkillNames = ['dart', 'fireBall', 'magicBall']
            if (bulletSkillNames.includes(skillName)) {
                addSkill('bullet')
                return
            }
            addSkill(skillName)
        }
    }

    setLevel(role, skillName, level = 1) {
        if (!role) return
        if (role.state.lose) return
        if (level === null) {
            this.set(role, skillName, level)
            delete M('fight').player.skill[skillName]
            return
        }
        this.set(role, skillName, level)
        M('fight').setSkillNum(skillName, 'level', level)
        E.emit(this.eventType.SET_LEVEL, role, skillName)
    }

    setPassiveLevel(role, skillName, level = 1) {
        if (!role) return
        if (role.data.HP <= 0) return
        M('fight').setPassiveSkillNum(skillName, 'level', level)
        let passoveSkill = M('fight').player.passiveSkill[skillName]

        if (skillName == 'HP' || skillName == 'ATK') {
            let selectRoleData = M('data').roles.find(a => a.selected)
            let defData = M('role').createPlayerData(selectRoleData.asset)
            let pencent = passoveSkill.level * passoveSkill.pencent

            if (skillName == 'HP') {
                role.data.default[skillName] = H.num(role.data.default[skillName] + (defData[skillName] * (pencent / 100)))
                role.setHP(role, {value: role.data.default.HP})
            }

            if (skillName == 'ATK') {
                role.data[skillName] = H.num(role.data[skillName] + (defData[skillName] * (pencent / 100)))
                role.data.default[skillName] = H.num(role.data.default[skillName] + (defData[skillName] * (pencent / 100)))
            }
        }
        if (skillName == 'SPD') {
            role.setMoveSpeed(passoveSkill.level + 1)
        }
        if (skillName == 'propRadius') {
            role.setPropRadius(passoveSkill.level + 1)
        }
        E.emit(this.eventType.SET_PASSIVE_LEVEL, role, skillName)
    }
}

