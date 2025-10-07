import { _decorator, Component, sys, game, director, assetManager, color, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

declare global {
    var log: typeof console.log;
    var app: any;
}

globalThis.log = console.log

interface LanguageTexts {
    load_failed: string;
    load_wait: string;
    tip_inst: string;
}

interface LangConfig {
    zh: LanguageTexts;
    en: LanguageTexts;
    // 可以扩展其他语言...
}

const lang: LangConfig = {
    zh: {
        load_failed: '加载失败\n(检查后网络重试)',
        load_wait: '请稍后',
        tip_inst: '当前版本太旧\n需重新下载最新版本',
    },
    en: {
        load_failed: 'Loading Failed',
        load_wait: 'Please wait',
        tip_inst: 'The current版本 is too old\nYou need to download the latest version again',
    }
}

const L = (key: keyof LanguageTexts) => {
    if (sys.language === 'zh') {
        return lang['zh'][key];
    }
    else if (sys.language === 'en') {
        return lang['en'][key]
    }
    return lang['en'][key]
}




globalThis.app = {}
app.loader = {}
app.loader.version = 1 //安装包版本
app.loader.url = ''

app.config = {}
app.config.version = 100

app.config.isLocal = true

@ccclass('init')
export class init extends Component {
    @property(Node)
    loadingNode: Node = null;
    @property(Label)
    label: Label = null

    async start() {
        if (this.loadingNode) {
            this.loadingNode.active = true
        }
        if (this.label) {
            this.label.string = L('load_wait')
        }
        let config = await this.loadConfig(app.loader.url) as any;
        if (config.loader) {
            if (config.loader.version != app.loader.version) {
                this.tip(L('tip_inst'))
                this.node.on('touch-end', e => {
                    if (config.loader.downloadUrl) {
                        sys.openURL(config.loader.downloadUrl)
                    } else {
                        game.end()
                    }
                })
                return
            }
        }
        app.config = {...app.config, ...config}
        console.log('[init]', app)
        let bundle = await this.loadBundle(app.config.bundle) as any;
        bundle.loadScene(bundle.name, (err, scene) => {
            if (err) {
                log('[bundle.loadScene]', err)
                this.error(L('load_failed'))
                return
            }
            director.runScene(scene)
        })
    }

    loadConfig(jsonUrl) {
        return new Promise(resolve => {
            if (!jsonUrl) {
                resolve({bundle: {version: '', url: ''}})
                return
            }
            assetManager.loadRemote(jsonUrl + '?' + new Date().getTime(), {ext: '.json'}, (err, res) => {
                if (err) {
                    log('[init.loadConfig]error', err)
                    this.error(L('load_failed'))
                    return
                }
                resolve(res.json)
            })
        })
    }

    loadBundle(param) {
        param = {...{
            url: '',
            version: '',
        }, ...param}
        if (app.config.isLocal || !sys.isNative) {
            param.url = ''
            param.version = ''
        }
        return new Promise(resolve => {
            let bundleUrl = param.url ? param.url + '/app' : 'app'
            assetManager.loadBundle(bundleUrl, {
                version: param.version,
                onFileProgress: (completed, total) => {
                    let percent = Math.round((completed / total) * 100)
                    if (percent < 0) percent = 0
                    if (percent >= 100) {
                        this.label.string = L('load_wait')
                    } else {
                        this.label.string = percent + '%'
                    }
                },
            }, (err, bundle) => {
                if (err) {
                    log('[init.loadBundle]error', err)
                    if (bundle) bundle.releaseAll()
                    this.error(L('load_failed'))
                    return
                }
                resolve(bundle)
            })
        })
    }

    tip(stringStr, colorStr = '#FFFFFF') {
        this.loadingNode.active = false
        this.label.color = color(colorStr)
        this.label.string = stringStr
    }

    error(string) {
        this.tip(string, '#FF0000')
        this.node.once('touch-end', e => {
            game.restart()
        })
    }
}