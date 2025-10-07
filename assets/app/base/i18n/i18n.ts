import { _decorator, director } from 'cc';
const { ccclass } = _decorator;
import polyglot from '../common/lib/polyglot.min.js'

@ccclass('i18n')
export class i18n {
    language = cc.sys.language
    defLanguage = 'zh'
    isInit = false
    data = {}

    init(language = 'zh', defLanguage = 'zh') {
        this.defLanguage = defLanguage
        if (language == 'zh') {
            if (!this.isHans()) language = 'zh_hant'
        }
        const init = (lang) => {
            let langClass = cc.js.getClassByName(lang)
            if (!langClass) {
                if (lang == 'zh_hant') lang = 'zh'
                langClass = cc.js.getClassByName(lang)
                if (!langClass) throw '[i18n error]' + lang
            }
            this.language = lang
            langClass = new langClass()
            this.data = langClass.data
            this.initPolyglot(langClass.data)
            this.upd()
        }
        try {
            init(language)
        } catch(err) {
            console.log(err)
            try {
                init(defLanguage)
            } catch(err) {
                console.log(err)
            }
        }
        this.isInit = true
    }

    initPolyglot(data) {
        if (data) {
            if (this.polyglot) {
                this.polyglot.replace(data)
            } else {
                this.polyglot = new polyglot({ phrases: data, allowMissing: true })
            }
        }
    }

    t(key, opt) {
        if (!this.polyglot) return
        return this.polyglot.t(key, opt)
    }

    upd() {
        const rootNodes = director.getScene().children
        const allLocalizedLabels = []
        for (let i = 0; i < rootNodes.length; ++i) {
            let labels = rootNodes[i].getComponentsInChildren('LocalizedLabel')
            Array.prototype.push.apply(allLocalizedLabels, labels)
        }
        for (let i = 0; i < allLocalizedLabels.length; ++i) {
            let label = allLocalizedLabels[i]
            if(!label.node.active) continue
            label.updateLabel()
        }
        const allLocalizedSprites = []
        for (let i = 0; i < rootNodes.length; ++i) {
            let sprites = rootNodes[i].getComponentsInChildren('LocalizedSprite')
            Array.prototype.push.apply(allLocalizedSprites, sprites)
        }
        for (let i = 0; i < allLocalizedSprites.length; ++i) {
            let sprite = allLocalizedSprites[i]
            if(!sprite.node.active) continue
            sprite.updateSprite()
        }
    }

    //是否简体中文
    isHans() {
        let language = cc.sys.language.toLowerCase()
        if (language === 'zh') {
            let languageCode = cc.sys.languageCode.toLowerCase()
            if (languageCode.indexOf('hans') != -1
            || languageCode == 'zh'
            || languageCode == 'zh-cn'
            || languageCode == 'zh_cn') {
                return true
            }
        }
        return false
    }
}