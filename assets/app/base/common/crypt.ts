import { _decorator } from 'cc';
const { ccclass } = _decorator;

import CryptoJS from './lib/crypto-js.js';

@ccclass('crypt')
export class crypt {
    md5(str: any) {
        return CryptoJS.MD5(str).toString()
    }

    sha1(str: any) {
        return CryptoJS.SHA1(str).toString()
    }

    dataMd5(data: any) {
        return this.md5(JSON.stringify(data))
    }

    //密钥32位 AES-256-ECB
    encode(str: any, key: any) {
        try {
            str = JSON.stringify(str)
            let keyHex = CryptoJS.enc.Utf8.parse(key)
            let encrypted = CryptoJS.AES.encrypt(str, keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            })
            return encodeURIComponent(CryptoJS.enc.Base64.stringify(encrypted.ciphertext))
        } catch (err) {
            console.warn('crypt.encode', err)
        }
    }

    decode(str: any, key: any) {
        try {
            str = decodeURIComponent(str)
            let keyHex = CryptoJS.enc.Utf8.parse(key)
            let decrypted = CryptoJS.AES.decrypt({
                ciphertext: CryptoJS.enc.Base64.parse(str)
            }, keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            })
            return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
        } catch (err) {
            console.warn('crypt.decode', err)
        }
    }
}

