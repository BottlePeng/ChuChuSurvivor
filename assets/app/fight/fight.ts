import { _decorator, Camera, find, input, Input, KeyCode, PhysicsSystem2D ,} from 'cc';
import { ccBase } from '../base/component/ccBase';
const { ccclass } = _decorator;

@ccclass('fight')
export class fight extends ccBase {
    show() {
        //if (H.isDev()) PhysicsSystem2D.instance.debugDrawFlags = true
        this.addBtnEvents()
        this.init()

        //测试初始化
        // this.initTest()

        this.schedule(this.update1s, 1)

        return this._show(this)
    }

    init() {
        let audioArr:string[] = ['fight_bgm1', 'fight_bgm2']
        G('audio').playMusic(H.randArr(audioArr))

        let _camera = find('Canvas/Camera')
        this.camera = $(_camera, Camera)
        this.rvo = $(this.node, 'rvo')

        M('fight').init()
        M('fight').level = M('data').fight.selectLevel

        G('fight').init({
            parent1Node: this.find('roleParent'),
            parent2Node: this.find('roleParent2'),
            effectParent2Node: this.find('effectParent2'),
            shadowParentNode: this.find('shadowParent'),
        })

        G('skill').init({
            parent1Node: this.find('skillParent'),
            parent2Node: this.find('skillParent2'),
        })

        G('effect').init({
            parent1Node: this.find('effectParent'),
            parent2Node: this.find('effectParent2'),
        })

        G('tip').init({
            fightTipParentNode: this.find('tipParent')
        })

        if (H.isBrowser()) {
            this.keyboardInput = H.add$(this.find('input'), 'keyboardInput')
        }
        this.joystickInput = this.find('joystickInput', 'joystickInput')

        let selectRoleData = M('data').roles.find(a => a.selected)
        this.player = G('fight').createPlayerRole({
            asset: selectRoleData.asset,
            data: M('role').createPlayerData(selectRoleData.asset),
        })
        this.player.initCamera(this.camera)
        if (H.isBrowser()) {
            this.player.initInput([this.keyboardInput, this.joystickInput])
        } else {
            this.player.initInput(this.joystickInput)
        }
        this.infiniteMap = this.find('infiniteMap', 'infiniteMap')
        this.infiniteMap.init(this.player.node)

        G('dropProp').init({
            parent1Node: this.find('dropParent'),
            parent2Node: this.find('dropParent2'),
            player: this.player,
        })

        this.minute = 0
        this.enemyCalPercent = 50
        this.enemyCalHPPercent = 50

        this.maxEnemyBossNum = 10
        this.maxEnemyRangeNum = 50
        this.maxEnemyNearNum = 300
        this.maxPropNum = 1000

        this.expProgressBar = this.find('expProgressBar', cc.ProgressBar)
        this.expProgressBar.progress = 0

        this.levelLabel = this.find('levelLabel', cc.Label, this.expProgressBar.node)
        this.levelLabel.string = 'Lv' + H.num(M('fight').player.level)

        this.fightLevelLabel = this.find('fightLevelLabel', cc.Label)
        this.fightLevelLabel.string = L('fightLevel', {level: H.numAbbr(M('fight').level)})

        this.secondLabel = this.find('secondLabel', cc.Label)
        this.secondLabel.string = H.secondFormat(M('fight').second, '{mm}:{ss}')

        this.killCountLabel = this.find('killCount/Label', cc.Label)
        this.killCountLabel.string = H.num(M('fight').kill)

        this.goldCountLabel = this.find('goldCount/Label', cc.Label)
        this.goldCountLabel.string = H.num(M('fight').reward.prop.gold)


        this.fightSkillThumb = this.find('fightSkillThumb', 'fightSkillThumb')
        this.fightSkillThumb.init(this)

        M('fight').stop = false

        this.addEvent('role.lose', this.onLose)

        G('skill').setLevel(this.player, M('role').getPlayerBaseData(this.player.asset).skillName, 1)
    }

    initTest() {
        //游戏时间
        M('fight').second = 30 * 60;
        G('skill').setLevel(this.player, M('role').getPlayerBaseData(this.player.asset).skillName, 8)
        //随机技能
        let assets = M('skill').getAssets().filter(asset => asset != M('role').getPlayerBaseData(this.player.asset).skillName)
        let skillAssets = H.randArr(assets, 4)
        H.forArr(skillAssets, asset => {
            G('skill').setLevel(this.player, asset, 8)
        })

        //被动技能
        //G('skill').setPassiveLevel(this.player, 'propRadius', 9)
        // G('skill').setPassiveLevel(this.player, 'SPD', 9)
        // G('skill').setPassiveLevel(this.player, 'HP', 9)
        // G('skill').setPassiveLevel(this.player, 'ATK', 9)

        //火焰
        // let fireJet = H.add$(this.player.node, 'fireJet', true)
        // fireJet.init(this.player, 'fireJet')
        // fireJet.initData({
        //     timeout: false
        // })

        this.update1s()
        //this.createEnemyNears(1)
    }

    onLose(role) {
        if (role.group == 'player') {
            this.end()
            return
        }

        M('fight').kill += 1

        if (role.data.bossLevel) {
            if (role.data.bossLevel > 1) {
                if (M('fight').level >= M('data').fight.level) {
                    M('fight').addRewardPropNum('equipNum', 5)
                } else {
                    M('fight').addRewardPropNum('equipNum', 1)
                }
                return
            }
            if (H.calProb(20)) {
                let prop = G('dropProp').create({
                    name: 'dropEquip',
                    by: role.node,
                })
                prop.onRemove = () => {
                    G('audio').playEffect('equip')
                    M('fight').addRewardPropNum('equipNum', 1)
                }
                return
            }
            let prop = G('dropProp').create({
                name: 'dropBox',
                by: role.node,
            })
            prop.onRemove = () => {
                G('audio').playEffect('upLevel')
                M('fight').stop = true
                let fightUpLevel = V('fightUpLevel').show(this, 'box')
                fightUpLevel.onRemove = () => {
                    M('fight').stop = false
                }
            }
            return
        }

        let pickupDropProps = G('dropProp').getPickupDropProps()
        if (pickupDropProps.length >= this.maxPropNum) return
        if (H.calProb(0.05)) {
            let prop = G('dropProp').create({
                name: 'dropFireJet',
                by: role.node,
            })
            prop.onRemove = () => {
                let fireJet = H.add$(this.player.node, 'fireJet', true)
                fireJet.init(this.player, 'fireJet')
                fireJet.initData({
                    timeout: 10
                })
            }
            return
        }
        if (H.calProb(0.05)) {
            let prop = G('dropProp').create({
                name: 'healPotion',
                by: role.node,
            })
            prop.onRemove = () => {
                G('audio').playEffect('healPotion')
                this.player.setHP(this.player, {value: this.player.data.default.HP * 0.2})
            }
            return
        }

        if (H.calProb(0.01)) {
            let prop = G('dropProp').create({
                name: 'pickup',
                by: role.node,
            })
            prop.onRemove = type => {
                if (type != 'pickup') return
                G('audio').playEffect('pickup')
                H.forArr(G('dropProp').getPickupDropProps(), dropProp => {
                    dropProp.moveToTarget()
                })
            }
            return
        }

        const dropChip = (type) => {
            let name = type == 'role' ? 'dropRoleChip' : 'dropSkillChip'
            let prop = G('dropProp').create({
                name: name,
                by: role.node,
            })
            prop.onRemove = () => {
                G('audio').playEffect('ding')
                M('fight').addRewardChip(type)
            }
        }

        if (H.calProb(0.05)) {
            dropChip('role')
            return
        }
        if (H.calProb(0.05)) {
            dropChip('skill')
            return
        }
        if (H.calProb(5)) {
            let prop = G('dropProp').create({
                name: 'dropGold',
                by: role.node,
            })
            prop.onRemove = () => {
                G('audio').playEffect('coin')
                M('fight').addRewardPropNum('gold')
            }
            return
        }
        const updExp = (val) => {
            let prop = G('dropProp').create({
                name: 'dropExp' + val,
                by: role.node,
            })
            prop.onRemove = () => {
                G('audio').playEffect('ding')
                M('fight').player.exp += val
                if (M('fight').player.exp >= M('fight').player.nextExp) {
                    this.upLevel()
                }
            }
        }
        if (this.minute <= 5) {
            if (H.calProb(5)) {
                updExp(2)
            } else {
                updExp(1)
            }
            return
        }
        if (this.minute > 5 && this.minute <= 10) {
            if (H.calProb(30)) {
                updExp(2)
            } else {
                updExp(1)
            }
        } else {
            if (H.calProb(30)) {
                updExp(3)
            } else {
                updExp(2)
            }
        }
    }

    end() {
        M('fight').stop = true
        if (app.getView('fightStop')) return
        V('fightStop').show(this)
    }

    upLevel() {
        G('audio').playEffect('upLevel')
        this.expProgressBar.progress = M('fight').player.exp / M('fight').player.nextExp
        M('fight').stop = true
        M('fight').upLevel()
        let fightUpLevel = V('fightUpLevel').show(this, 'exp')
        fightUpLevel.onRemove = () => {
            this.levelLabel.string = 'Lv' + H.num(M('fight').player.level)
            M('fight').stop = false
        }
    }

    stopBtnEvent() {
        this.end()
    }

    createEnemyBoss(bossLevel = 1) {
        let enemys = G('fight').roles.filter(a => {
            return a.group == 'enemy' && a.data.bossLevel > 0
        })
        if (enemys.length >= this.maxEnemyBossNum) return
        let enemy = G('fight').createEnemyRole({
            asset: H.randArr(M('role').getAssets()),
            data: M('role').createEnemyData({
                level: M('fight').level,
                bossLevel: bossLevel,
                calPercent: this.enemyCalPercent,
                calHPPercent: this.enemyCalHPPercent,
            }),
            type: 1, //1=近战 2=远程 3=移动
            target: this.player,
            rvo: this.rvo,
            layer: 1,
        })

        if (this.minute <= 5) return

        let arr = ['enemyBullet1', 'enemyBullet2', 'enemyBullet3', 'enemyBullet4']
        let bulletDatas = []
        if (bossLevel > 0) {
            bulletDatas.push({
                asset: H.randArr(arr),
                scale: bossLevel,
                speed: 200,
                cd: 2,
                pierce: false, //穿透
                isRound: true, //环绕一圈: (360 / angle / 2) = num
            })
        }
        if (bossLevel > 1) {
            bulletDatas.push({
                asset: H.randArr(arr),
                scale: bossLevel,
                angle: 15,
                num: 5,
                speed: 400,
                cd: 1.5,
                pierce: false, //穿透
            })
        }
        enemy.skills = []
        H.forArr(bulletDatas, bulletData => {
            let skill = H.add$(enemy.node, 'bullet')
            skill.initData(bulletData)
            skill.init(enemy)
            enemy.skills.push(skill)
        })
    }

    createEnemyGroups() {
        G('fight').createEnemyGroupRoles({
            asset: H.randArr(M('role').getGroupAssets()),
            data: M('role').createEnemyData({
                level: M('fight').level,
                calPercent: this.enemyCalPercent,
                calHPPercent: 10,
            }),
            target: this.player,
            num: 20,
            layer: 2,
        })
    }

    createEnemyRanges(num = 20) {
        let enemys = G('fight').roles.filter(a => {
            return a.group == 'enemy' && a.type == 2
        })
        if (enemys.length >= this.maxEnemyRangeNum) return

        let assets = M('role').getRangeAssets()
        let asset = H.randArr(assets)
        for (let i = 1; i <= num; i++) {
            let enemy = G('fight').createEnemyRole({
                asset: asset,
                target: this.player,
                data: M('role').createEnemyData({
                    level: M('fight').level,
                    calPercent: this.enemyCalPercent,
                    calHPPercent: this.enemyCalHPPercent,
                }),
                type: 2, //1=近战 2=远程 3=移动
                target: this.player,
                rvo: this.rvo,
                layer: 1,
            })
            enemy.skills = [H.add$(enemy.node, 'bullet')]
            enemy.skills[0].init(enemy)
            let arr = ['enemyBullet1', 'enemyBullet2', 'enemyBullet3', 'enemyBullet4']
            enemy.skills[0].initData({
                asset: H.randArr(arr)
            })
        }
    }

    createEnemyNears(num = 1) {
        let enemys = G('fight').roles.filter(a => {
            return a.group == 'enemy' && a.type == 1
        })
        if (enemys.length >= this.maxEnemyNearNum) return
        if (num > 50) num = 50
        for (let i = 1; i <= num; i++) {
            let assets = M('role').getNearAssets()
            G('fight').createEnemyRole({
                asset: H.randArr(assets),
                target: this.player,
                data: M('role').createEnemyData({
                    level: M('fight').level,
                    calPercent: this.enemyCalPercent,
                    calHPPercent: this.enemyCalHPPercent,
                }),
                type: 1, //1=近战 2=远程 3=移动
                target: this.player,
                rvo: this.rvo,
                layer: 1,
            })
        }
    }

    onKeyDown(e) {
        if (e.keyCode == KeyCode.ESCAPE) {
            if (M('fight').stop) return
            this.end()
        }
    }

    onEnable() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
    }

    onDisable() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this)
    }

    onDestroy() {
        this.camera.node.setPosition(0, 0)
    }

    //更新结束
    updEnd() {
        if (!this.player) return
        if (this.player.state.lose) {
            this.end()
            return
        }
        if (M('fight').second >= M('fight').maxSecond) {
            let targets = G('fight').roles.filter(a => {
                return a.group != 'player'
            })
            if (targets.length < 1) {
                if (M('fight').level >= M('data').fight.level) {
                    M('data').fight.level += 1
                    M('data').fight.selectLevel = M('data').fight.level
                    M('achive').incCount('useRole', this.player.asset)
                    M('data').save()
                    M('gameCenter').sendLevel()
                }
                this.end()
            }
        }
    }

    //更新敌人
    updEnemys() {
        if (!this.player) return
        if (M('fight').stop) return
        if (M('fight').second >= M('fight').maxSecond) {
            if (M('fight').second == M('fight').maxSecond) {
                this.createEnemyBoss(2)
            }
            return
        }
        this.enemyCalPercent = parseInt(this.minute * 10)
        this.enemyCalHPPercent = parseInt(this.minute * 20)

        if ((M('fight').second % 60) == 0) {
            this.createEnemyBoss()
            if (this.minute >= 5) this.createEnemyRanges(20)
        }

        if (H.calProb(20)) this.createEnemyGroups()

        let num = this.minute
        if (this.minute >= 5) num = this.minute * 2
        if (num < 1) num = 1
        this.createEnemyNears(num)
    }

    //更新时间
    updTime() {
        if (!this.player) return
        if (M('fight').stop) return
        M('fight').second += 1
        this.secondLabel.string = H.secondFormat(M('fight').second, '{mm}:{ss}')
        this.minute = parseInt(M('fight').second / 60)
    }

    update1s() {
        this.updTime()
        this.updEnd()
        this.updEnemys()
    }

    update(dt) {
        if (M('fight').stop) {
            this.rvo.stop = true
            return
        }
        this.rvo.stop = false
        this.expProgressBar.progress = M('fight').player.exp / M('fight').player.nextExp
        this.killCountLabel.string = H.num(M('fight').kill)
        this.goldCountLabel.string = H.num(M('fight').reward.prop.gold)
    }
}

