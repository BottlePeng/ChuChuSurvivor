import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('zh')
export class zh {
    data = {
        app_name: '楚楚幸存者',
        ios_app_name: '楚楚幸存者',
        android_app_name: '楚楚幸存者',

        error_action: '操作失败',
        error_chip: '碎片不足',
        error_gold: '金币不足',
        error_role: '角色异常',
        error_timeout: '超时',
        error_ad: '没有合适的广告请稍后再试',
        error_ad_ready: '广告没有准备好',
        error_equipNum: '装备宝箱不足',
        error_cd: '冷却中',
        error_revive: '复活次数不足',
        error_equip_level: '不能超过当前关卡',
        error_version: '有新的版本\n点击退出重启游戏?',
        error_guest: '游客不能操作',
        error_data: '数据不存在',
        error_length: '长度%{length}个字符',
        error_sid_friendSid: '不能输入自己的ID',
        error_sid_max: '绑定数量上限',
        error_sid_self: '该ID已被您绑定',
        error_select_role: '不能选择未拥有的英雄',
        error_no_upLevel: '没有可以升级的',

        success_action: '操作成功',
        success_uploadData: '上传成功',
        success_upLevel: '升级成功',
        success_buy: '购买成功',
        success_gain: '获取成功',
        success_revive: '复活成功',

        adRequestTrackingAuthorizationTip: '为了游戏中正常获取广告奖励，请同意我们使用设备[标识符]\n该标识符只用于游戏正常拉取广告',

        loading: '加载中',

        login_guest: '游客登录',
        login_qq: 'QQ登录',
        login_taptap: 'TapTap登录',
        login_apple: 'Apple登录',
        login_out: '退出登录',

        delete_data: '删除数据',
        exitGame: '退出游戏',

        sid: 'ID',
        copy: '复制',
        input: '输入',

        doc_user: '用户协议',
        doc_privacy: '隐私政策',
        reportToAdmin: '问题反馈',

        uploadData: '上传数据',
        never: '从未',

        yes: '确定',
        close: '关闭',
        agree: '同意',
        refuse: '拒绝',

        guestLoginTips: '游客模式不能云存档\n是否进入游戏?',
        sidTip: '输入朋友的ID获得奖励',
        playDayTip: '已陪伴您 %{day} 天',
        roleHelpTip: '购买或升级其他角色给已选择英雄\n[+2生命]或[+1攻击]',
        skillHelpTip: '升级技能给已选择英雄\n[+1生命]或[+0.5攻击]',
        deleteDataTip: '删除本机和服务器数据，是否继续?',
        reportToAdminTip: '请告诉我们您遇到的问题',

        gameCenterSignTip: '未登录GameCenter\n是否在手机设置里打开?',
        gameCenterSend: '上传成绩',

        frameRate: '战斗帧率',
        startGame: '开始游戏',

        notHave: '未拥有',

        get: '领取',
        canGain: '可领取',
        buy: '购买',
        select: '选择',
        upLevel: '升级',
        allUpLevel: '一键升级',
        gain: '获取',
        allGain: '全部获取',

        continue: '继续',
        exit: '退出',
        revive: '复活',

        noAttr: '无属性',
        noEquip: '无装备',
        currentEquip: '当前装备',
        all: '全部',
        condition: '条件',

        sell: '出售',
        equip: '装备',
        hero: '英雄',
        skill: '技能',
        achive: '成就',
        hurt: '伤害',
        dps: '每秒',

        ATKPencent: '攻击',
        HPPencent: '生命',
        critOdds: '暴击',
        doubleOdds: '双倍',

        audioMusic: '音乐',
        audioEffect: '音效',

        fightLevel: '第 %{level} 关',

        total: '总计',
        done: '完成',
        achiveInfo: {
            lookAd: {
                video: '观看广告'
            },
            gainProp: {
                gold: '战斗中获取金币',
                equipNum: '战斗中获取装备宝箱',
            },
            useRole: '使用当前英雄通关',
            useSkill: '战斗中使用当前技能',
            usePassiveSkill: '战斗中升至满级',
        },

        skillFightUplevel: '战斗升级',
        skillInfo: {
            hole: {
                title: '深渊',
                title2: '无尽',
                des: '对范围内敌人造成(0.5秒/次)伤害\n伤害,范围',
            },
            fireBall: {
                title: '火球',
                title2: '末日',
                des: '攻击最近的目标并击退\n冷却时间,伤害,范围,数量,穿透',
            },
            sword: {
                title: '剑',
                title2: '圣剑',
                des: '在身边环绕对敌人造成伤害并击退(格挡子弹)\n冷却时间,伤害,范围,数量,持续时间',
            },
            dart: {
                title: '飞镖',
                title2: '风魔',
                des: '发射多个攻击最近的目标\n冷却时间,伤害,范围,数量,穿透',
            },
            drug: {
                title: '毒液',
                title2: '剧毒',
                des: '在随机位置生成并且对敌人造成(0.2秒/次)\n伤害,范围,数量,持续时间',
            },
            stony: {
                title: '陨石',
                title2: '流星',
                des: '在身边环绕对敌人造成伤害并击退(格挡子弹)\n冷却时间,持续时间,伤害,范围,数量,速度',
            },
            magicBall: {
                title: '能量球',
                title2: '魔法球',
                des: '攻击最近的敌人\n冷却时间,伤害',
            },
            lightning: {
                title: '闪电',
                title2: '奔雷',
                des: '攻击随机目标并且爆炸(附带50%伤害)\n冷却时间,伤害,范围,数量',
            },
            boomerang: {
                title: '回旋镖',
                title2: '强力镖',
                des: '攻击随机目标并返回\n冷却时间,伤害,范围',
            },
            bomb: {
                title: '炸弹',
                title2: '爆破弹',
                des: '攻击随机目标爆炸造成范围伤害\n冷却时间,伤害,范围',
            },
            ice: {
                title: '冰箭',
                title2: '冰破',
                des: '攻击随机目标并冻结\n冷却时间,持续时间,伤害,数量,穿透',
            },
            knive: {
                title: '半月斩',
                title2: '月光斩',
                des: '攻击最近的目标并穿透(格挡子弹)\n冷却时间,伤害,范围,数量',
            },
            gem: {
                title: '宝石',
                title2: '璀璨',
                des: '攻击最近的目标并在视野边缘反射(持续5秒)\n冷却时间,伤害,数量',
            },
            laser: {
                title: '激光',
                title2: '超能',
                des: '随机方向造成(0.2秒/次)伤害\n冷却时间,持续时间,伤害,范围,数量',
            },
            tornado: {
                title: '龙卷风',
                title2: '风暴',
                des: '随机方向造成(0.2秒/次)伤害并卷入\n冷却时间,伤害,范围,数量,速度',
            },
        },

        passiveSkillInfo: {
            propRadius: {
                title: '拾取范围',
            },
            SPD: {
                title: '移动速度',
            },
            ATK: {
                title: '攻击力',
            },
            HP: {
                title: '生命上限',
            }
        }
    }
}

