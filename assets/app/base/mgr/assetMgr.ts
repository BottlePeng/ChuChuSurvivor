import { _decorator } from 'cc';
const { ccclass } = _decorator;

const defBundleName = 'app'

@ccclass('assetMgr')
export class assetMgr {
    bundleName = defBundleName

    onCall() {
        this.bundleName = defBundleName
    }

    bundle(bundleName) {
        this.bundleName = bundleName
        return this
    }

    getBundle(bundleName) {
        if (bundleName) return cc.assetManager.getBundle(bundleName)
        bundleName = this.bundleName
        this.bundleName = defBundleName
        return cc.assetManager.getBundle(bundleName)
    }

    getPaths(path, assetType) {
        let bundle = this.getBundle()
        if (!bundle) return []
        let paths = bundle.getDirWithPath(path, assetType)
        let res = []
        H.forArr(paths, path => {
            let pathArr = path.path.split('/')
            if (H.is$(assetType, cc.SpriteFrame) || H.is$(assetType, cc.Texture2D)) {
                path.name = pathArr[pathArr.length - 2]
            } else {
                path.name = pathArr[pathArr.length - 1]
            }
            res.push(path)
        })
        return res
    }

    loadBundle(namOrUrl, version = '', progressFunc, errFunc) {
        if (H.isFunc(version)) {
            errFunc = progressFunc
            progressFunc = version
            version = ''
        }
        if (!errFunc) {
            errFunc = progressFunc
            progressFunc = null
        }
        return new Promise((resolve, reject) => {
            if (errFunc) reject = errFunc
            cc.assetManager.loadBundle(namOrUrl, {
                version: version,
                onFileProgress: (completed, total) => {
                    if (progressFunc) progressFunc(completed, total)
                },
            }, (err, bundle) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(bundle)
            })
        })
    }

    assets = []
    load(path, assetType, errFunc) {
        if (H.is$(assetType, cc.SpriteFrame)) {
            let pathArr = path.split('/')
            if (pathArr[pathArr.length - 1] != 'spriteFrame') path += '/spriteFrame'
        }
        if (H.is$(assetType, cc.Texture2D)) {
            let pathArr = path.split('/')
            if (pathArr[pathArr.length - 1] != 'texture') path += '/texture'
        }
        let key = path + assetType.toString()
        return new Promise((resolve, reject) => {
            if (errFunc) reject = errFunc
            let asset = this.assets.filter(a => {
                return a.key == key
            })[0]
            if (asset) {
                resolve(asset.data)
                return
            }
            let bundle = this.getBundle()
            if (!bundle) {
                reject('bundle error')
                return
            }
            bundle.load(path, assetType, (err, res) => {
                if (err) {
                    reject(err)
                    return
                }
                if (!this.assets.some(a => a.key == key)) {
                    this.assets.push({
                        key: key,
                        data: res,
                    })
                }
                resolve(res)
            })
        })
    }

    loadDir(path, assetType, progressFunc, errFunc) {
        if (!errFunc) {
            errFunc = progressFunc
            progressFunc = null
        }
        return new Promise((resolve, reject) => {
            if (errFunc) reject = errFunc
            let bundle = this.getBundle()
            if (!bundle) {
                reject('bundle error')
                return
            }
            bundle.loadDir(path, assetType, (completed, total) => {
                if (progressFunc) progressFunc(completed, total)
            }, (err, arr) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(arr)
            })
        })
    }

    prefabs = []
    audioClips = []
    //预加载进内存(预制体和媒体)
    preLoadAssets(path, progressFunc, errFunc) {
        if (!errFunc) {
            errFunc = progressFunc
            progressFunc = null
        }
        return new Promise((resolve, reject) => {
            if (errFunc) reject = errFunc
            let bundle = this.getBundle()
            if (!bundle) {
                reject('bundle error')
                return
            }
            let promises = []
            const prefabPaths = bundle.getDirWithPath(path, cc.Prefab)
            const audioPaths = bundle.getDirWithPath(path, cc.AudioClip)
            let total = prefabPaths.length + audioPaths.length
            let completed = 0
            if (progressFunc) progressFunc(completed, total)
            H.forArr(prefabPaths, a => {
                promises.push(new Promise((resolve, reject) => {
                    bundle.load(a.path, cc.Prefab, (err, res) => {
                        if (err) {
                            reject(err)
                            return
                        }
                        let data = {}
                        data.bundleName = bundle.name
                        data.res = res
                        this.prefabs.push(data)
                        completed++
                        if (progressFunc) progressFunc(completed, total)
                        resolve()
                    })
                }))
            })
            H.forArr(audioPaths, a => {
                promises.push(new Promise((resolve, reject) => {
                    bundle.load(a.path, cc.AudioClip, (err, res) => {
                        if (err) {
                            reject(err)
                            return
                        }
                        let data = {}
                        data.bundleName = bundle.name
                        data.res = res
                        this.audioClips.push(data)
                        completed++
                        if (progressFunc) progressFunc(completed, total)
                        resolve()
                    })
                }))
            })
            Promise.all(promises).then(() => {
                setTimeout(() => {
                    resolve()
                }, 100)
            }).catch(err => {
                reject(err)
            })
        })
    }

    getPrefab(name) {
        let data = this.prefabs.filter(a => {
            let checkBundle = this.bundleName != defBundleName ? a.bundleName == this.bundleName : true
            return a.res.name == name && checkBundle
        })[0]
        if (data) return data.res
    }

    getAudioClip(name) {
        let data = this.audioClips.filter((a) => {
            let checkBundle = this.bundleName != defBundleName ? a.bundleName == this.bundleName : true
            return a.res.name == name && checkBundle
        })[0]
        if (data) return data.res
    }

    loadScene(name, progressFunc, errFunc) {
        if (!errFunc) {
            errFunc = progressFunc
            progressFunc = null
        }
        return new Promise((resolve, reject) => {
            if (errFunc) reject = errFunc
            let bundle = this.getBundle()
            if (!bundle) {
                reject('bundle error')
                return
            }
            bundle.loadScene(name, (completed, total) => {
                if (progressFunc) progressFunc(completed, total)
            }, (err, scene) => {
                if (err) {
                    reject(err)
                    return
                }
                cc.director.runScene(scene)
                resolve()
            })
        })
    }

    remoteAssets = []
    //ext = '.png'
    loadRemote(url, ext) {
        return new Promise((resolve, reject) => {
            if (!url) {
                reject()
                return
            }
            let remoteAsset = this.remoteAssets.filter(a => {
                return a.uuid == url
            })[0]
            if (remoteAsset) {
                resolve(remoteAsset)
                return
            }
            cc.assetManager.loadRemote(url, {ext: ext}, (err, asset) => {
                if (err) {
                    reject(err)
                    return
                }
                if (H.is$(asset, cc.ImageAsset)) {
                    let spriteFrame = cc.SpriteFrame.createWithImage(asset)
                    spriteFrame.name = H.fileName(asset.nativeUrl)
                    spriteFrame._uuid = asset.nativeUrl
                    let remoteAsset = this.remoteAssets.filter(a => {
                        return a.uuid == url
                    })[0]
                    if (remoteAsset) {
                        resolve(remoteAsset)
                        return
                    }
                    //强制合图
                    //dynamicAtlasManager.insertSpriteFrame(spriteFrame)
                    this.remoteAssets.push(spriteFrame)
                    resolve(spriteFrame)
                } else if (H.is$(asset, cc.AudioClip)) {
                    let remoteAsset = this.remoteAssets.filter(a => {
                        return a.uuid == url
                    })[0]
                    if (remoteAsset) {
                        resolve(remoteAsset)
                        return
                    }
                    this.remoteAssets.push(asset)
                    resolve(asset)
                } else if (H.is$(asset, cc.JsonAsset)) {
                    resolve(asset.json)
                } else if (H.is$(asset, cc.TextAsset)) {
                    resolve(asset.text)
                } else {
                    resolve(asset.nativeAsset)
                }
            })
        })
    }

    setSpriteFrame(sprite, path) {
        this.load(path, cc.SpriteFrame).then(spriteFrame => {
            sprite.spriteFrame = spriteFrame
        })
    }
}

