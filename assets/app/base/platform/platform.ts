import { _decorator } from 'cc';
const { ccclass } = _decorator;
if (typeof platformEvent == 'undefined') {
    globalThis.platformEvent = {}
}

@ccclass('platform')
export class platform {
    call(className, method, ...args) {
        log('[platform.call]' + className + '.' + method, ...args)
        if (H.isIos()) {
            if (Object.keys(args).length > 0) {
                return jsb.reflection.callStaticMethod(className, method + ':', ...args)
            }
            return jsb.reflection.callStaticMethod(className, method)
        }
        if (H.isAndroid()) {
            className = 'com/cocos/game/' + className
            return jsb.reflection.callStaticMethod(className, method, ...args)
        }
    }

    openSetting(name) {
        if (H.isIos()) {
            this.call('Platform', 'openSetting', name)
        }
    }

    share(param) {
        param = {...{
            title: '',
            content: '',
            url: '',
        }, ...param}
        if (H.isIos()) {
            this.call('Platform', 'share', JSON.stringify(param))
        }
        if (H.isAndroid()) {
            this.call('Platform', 'share', '(Ljava/lang/String;)V', JSON.stringify(param))
        }
        platformEvent.onShare = (...args) => {
            this.onShare(...args)
        }
    }

    onShare(...args) {
    }

    copyText(string) {
        if (H.isIos()) {
            this.call('Platform', 'copyText', string)
        } else if (H.isAndroid()) {
            this.call('Platform', 'copyText', '(Ljava/lang/String;)V', string)
        } else {
            //(参考)https://blog.csdn.net/EddyLwei/article/details/123382153
            let input = string + ''
            const el = document.createElement('textarea')
            el.value = input
            el.setAttribute('readonly', '')
            el.style.position = 'absolute'
            el.style.left = '-9999px'
            el.style.fontSize = '12pt'
            const selection = getSelection()
            let originalRange = null
            if (selection.rangeCount > 0) {
                originalRange = selection.getRangeAt(0)
            }
            document.body.appendChild(el)
            el.select()
            el.selectionStart = 0
            el.selectionEnd = input.length
            document.execCommand('copy')
            if (originalRange) {
                selection.removeAllRanges()
                selection.addRange(originalRange)
            }
            document.body.removeChild(el)
        }
    }
}

