import { _decorator, AnimationClip } from 'cc';
const { ccclass } = _decorator;

@ccclass('global')
export class global {
    layer = {
        ui: 1 << 0,
    }

    group = {
        player: 1 << 1,
        enemy: 1 << 2,
    }

    miscAsset = null
    skillAsset = null

    loadRoleSpriteFrame(asset, group = 'player') {
        return new Promise(resolve => {
            let path = 'role/' + group + '/' + asset + '/0'
            if (G('asset').getBundle('sub2')) {
                G('asset').bundle('sub2').load(path, cc.SpriteFrame).then(spriteFrame => {
                    resolve(spriteFrame)
                })
                return
            }
            path = 'subpackage/sub2/' + path
            G('asset').load(path, cc.SpriteFrame).then(spriteFrame => {
                resolve(spriteFrame)
            })
        })
    }

    loadRoleSpriteFrames(asset, group = 'player') {
        return new Promise(resolve => {
            let path = 'role/' + group + '/' + asset
            if (G('asset').getBundle('sub2')) {
                G('asset').bundle('sub2').loadDir(path, cc.SpriteFrame).then(spriteFrames => {
                    resolve(spriteFrames)
                })
                return
            }
            path = 'subpackage/sub2/' + path
            G('asset').loadDir(path, cc.SpriteFrame).then(spriteFrames => {
                resolve(spriteFrames)
            })
        })
    }

    loadRoleAnimClip(clipName) {
        return new Promise(resolve => {
            let path = 'role/' + clipName
            if (G('asset').getBundle('sub2')) {
                G('asset').bundle('sub2').load(path, cc.AnimationClip).then(AnimationClip => {
                    resolve(AnimationClip)
                })
                return
            }
            path = 'subpackage/sub2/' + path
            G('asset').load(path, cc.AnimationClip).then(AnimationClip => {
                resolve(AnimationClip)
            })
        })
    }

    loadEquipSpriteFrame(type, pos) {
        return new Promise(resolve => {
            let path = 'common/ui/equip/' + type + '/' + pos
            G('asset').load(path, cc.SpriteFrame).then(spriteFrame => {
                resolve(spriteFrame)
            })
        })
    }

    getSkillSpriteFrame(asset, index = 0) {
        if (!this.skillAsset) return
        return this.skillAsset[asset + 'SpriteFrames'][index]
    }

    getMiscSpriteFrame(asset) {
        if (!this.miscAsset) return
        return this.miscAsset[asset + 'SpriteFrame']
    }

    getFightBgItemPaths() {
        let path = 'infiniteMap/item'
        if (G('asset').getBundle('sub1')) {
            return G('asset').bundle('sub1').getPaths(path, cc.SpriteFrame)
        }
        path = 'subpackage/sub1/' + path
        return G('asset').getPaths(path, cc.SpriteFrame)
    }

    loadFightBgSpriteFrame(asset) {
        return new Promise(resolve => {
            let path = 'infiniteMap/bg/' + asset
            if (G('asset').getBundle('sub1')) {
                G('asset').bundle('sub1').load(path, cc.SpriteFrame).then(spriteFrame => {
                    resolve(spriteFrame)
                })
                return
            }
            path = 'subpackage/sub1/' + path
            G('asset').load(path, cc.SpriteFrame).then(spriteFrame => {
                resolve(spriteFrame)
            })
        })
    }
}

