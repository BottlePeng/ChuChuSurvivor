import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('server')
export class server {
    url = ''
    key = ''//密钥32位

    encode(data) {
        return R('crypt').encode(data, this.key)
    }

    decode(cryptStr) {
        return R('crypt').decode(cryptStr, this.key)
    }

    //自己实现服务器存储接口
    api(name, data = {}, method = 'POST') {
        return new Promise((resolve, reject) => {
            resolve()
        })
    }
}

