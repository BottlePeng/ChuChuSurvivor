import { _decorator } from 'cc';
import { ccApp } from './base/component/ccApp';
const { ccclass, property } = _decorator;

@ccclass('App')
export class App extends ccApp {
    @property(cc.Prefab)
    loadingPrefab = null

    async start() {
        this.init({appName: 'MBRO'})
        app.i18n.init(cc.sys.language, 'en')
        this.loading = H.inst(this.loadingPrefab, 'loading', this.node)

        this.loading.tip(L('loading'))
        await G('asset').preLoadAssets('./', (completed, total) => {
            this.loading.upd(completed, total)
        }, err => {
            this.loading.error(err)
        })

        await this.loadSubpackage()

        this.loading.remove()

        V('root').show()
    }

    //sub1 sub2 sub3 Bundle类型设置为小游戏分包 (这些目录名称不要修改，其他地方有用到)
    async loadSubpackage() {
        let subs = ['sub1', 'sub2', 'sub3']
        for (let i = 0; i < subs.length; i++) {
            let subName = subs[i]
            this.loading.tip(L('loading') + ' [' + subName + ']')
            await G('asset').loadBundle(subName, (completed, total) => {
                this.loading.upd(completed, total)
            }, err => {
                this.loading.error(err)
            })
            await G('asset').bundle(subName).preLoadAssets('./', (completed, total) => {
                this.loading.upd(completed, total)
            }, err => {
                this.loading.error(err)
            })
        }
    }
}