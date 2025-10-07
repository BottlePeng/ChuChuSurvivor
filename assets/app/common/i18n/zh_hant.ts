import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('zh_hant')
export class zh_hant {
    data = {
        app_name: '魔法兄弟',
        ios_app_name: '魔法兄弟',
        android_app_name: '魔獸兄弟',

        error_action: '操作失敗',
        error_chip: '碎片不足',
        error_gold: '金幣不足',
        error_role: '角色异常',
        error_timeout: '超時',
        error_ad: '沒有合適的廣告請稍後再試',
        error_ad_ready: '廣告沒有準備好',
        error_equipNum: '裝備寶箱不足',
        error_cd: '冷卻中',
        error_revive: '復活次數不足',
        error_equip_level: '不能超過當前關卡',
        error_version: '有新的版本\n點擊退出重啓遊戲？',
        error_guest: '遊客不能操作',
        error_data: '數據不存在',
        error_length: '長度%{length}個字元',
        error_sid_friendSid: '不能輸入自己的ID',
        error_sid_max: '綁定數量上限',
        error_sid_self: '該ID已被您綁定',
        error_select_role: '不能選擇未擁有的英雄',
        error_no_upLevel: '沒有可以陞級的',

        success_action: '操作成功',
        success_uploadData: '上傳成功',
        success_upLevel: '陞級成功',
        success_buy: '購買成功',
        success_gain: '獲取成功',
        success_revive: '復活成功',

        adRequestTrackingAuthorizationTip: '為了遊戲中正常獲取廣告獎勵，請同意我們使用設備[識別字]\n該識別字只用於遊戲正常拉取廣告',

        loading: '加載中',

        login_guest: '遊客登錄',
        login_qq: 'QQ登入',
        login_taptap: 'TapTap登入',
        login_apple: 'Apple登入',
        login_out: '登出',

        delete_data: '删除數據',
        exitGame: '退出遊戲',

        sid: 'ID',
        copy: '複製',
        input: '輸入',

        doc_user: '使用者協定',
        doc_privacy: '隱私政策',
        reportToAdmin: '問題迴響',

        uploadData: '上傳數據',
        never: '從未',

        yes: '確定',
        close: '關閉',
        agree: '同意',
        refuse: '拒絕',

        guestLoginTips: '遊客模式不能雲存檔\n是否進入遊戲？',
        sidTip: '輸入朋友的ID獲得獎勵',
        playDayTip: '已陪伴您%{day}天',
        roleHelpTip: '購買或陞級其他角色給已選擇英雄\n[+2生命]或[+1攻擊]',
        skillHelpTip: '陞級技能給已選擇英雄\n[+1生命]或[+0.5攻擊]',
        deleteDataTip: '删除本機和服務器數據,是否繼續？',
        reportToAdminTip: '請告訴我們您遇到的問題',

        gameCenterSignTip: '未登錄GameCenter\n是否在手機設定裏打開？',
        gameCenterSend: '上傳成績',

        frameRate: '戰鬥幀率',
        startGame: '開始遊戲',

        notHave: '未擁有',

        get: '領取',
        canGain: '可領取',
        buy: '購買',
        select: '選擇',
        upLevel: '陞級',
        allUpLevel: '一鍵陞級',
        gain: '獲取',
        allGain: '全部獲取',

        continue: '繼續',
        exit: '退出',
        revive: '復活',

        noAttr: '無内容',
        noEquip: '無裝備',
        currentEquip: '當前裝備',
        all: '全部',
        condition: '條件',

        sell: '出售',
        equip: '裝備',
        hero: '英雄',
        skill: '技能',
        achive: '成就',
        hurt: '傷害',
        dps: '每秒',

        ATKPencent: '攻擊',
        HPPencent: '生命',
        critOdds: '暴擊',
        doubleOdds: '雙倍',

        audioMusic: '音樂',
        audioEffect: '音效',

        fightLevel: '第%{level}關',

        total: '總計',
        done: '完成',
        achiveInfo: {
            lookAd: {
                video: '觀看廣告'
            },
            gainProp: {
                gold: '戰鬥中獲取金幣',
                equipNum: '戰鬥中獲取裝備寶箱',
            },
            useRole: '使用當前英雄通關',
            useSkill: '戰鬥中使用當前技能',
            usePassiveSkill: '戰鬥中升至滿級',
        },

        skillFightUplevel: '戰鬥陞級',
        skillInfo: {
            hole: {
            title: '深淵',
            title2: '無盡',
            des: '對範圍內敵人造成（0.5秒/次）傷害\n傷害,範圍',
            },
            fireBall: {
            title: '火球',
            title2: '末日',
            des: '攻擊最近的目標並擊退\n冷卻時間,傷害,範圍,數量,穿透',
            },
            sword: {
            title: '劍',
            title2: '聖劍',
            des: '在身邊環繞對敵人造成傷害並擊退（格擋子彈）\n冷卻時間,傷害,範圍,數量,持續時間',
            },
            dart: {
            title: '飛鏢',
            title2: '風魔',
            des: '發射多個攻擊最近的目標\n冷卻時間,傷害,範圍,數量,穿透',
            },
            drug: {
            title: '毒液',
            title2: '劇毒',
            des: '在隨機位置生成並且對敵人造成（0.2秒/次）\n傷害,範圍,數量,持續時間',
            },
            stony: {
            title: '隕石',
            title2: '流星',
            des: '在身邊環繞對敵人造成傷害並擊退（格擋子彈）\n冷卻時間,持續時間,傷害,範圍,數量,速度',
            },
            magicBall: {
            title: '能量球',
            title2: '魔法球',
            des: '攻擊最近的敵人\n冷卻時間,傷害',
            },
            lightning: {
            title: '閃電',
            title2: '奔雷',
            des: '攻擊隨機目標並且爆炸（附帶50%傷害）\n冷卻時間,傷害,範圍,數量',
            },
            boomerang: {
            title: '迴旋鏢',
            title2: '强力鏢',
            des: '攻擊隨機目標並返回\n冷卻時間,傷害,範圍',
            },
            bomb: {
            title: '炸彈',
            title2: '爆破彈',
            des: '攻擊隨機目標爆炸造成範圍傷害\n冷卻時間,傷害,範圍',
            },
            ice: {
            title: '冰箭',
            title2: '冰破',
            des: '攻擊隨機目標並凍結\n冷卻時間,持續時間,傷害,數量,穿透',
            },
            knive: {
            title: '半月斬',
            title2: '月光斬',
            des: '攻擊最近的目標並穿透（格擋子彈）\n冷卻時間,傷害,範圍,數量',
            },
            gem: {
            title: '寶石',
            title2: '璀璨',
            des: '攻擊最近的目標並在視野邊緣反射（持續5秒）\n冷卻時間,傷害,數量',
            },
            laser: {
            title: '雷射',
            title2: '超能',
            des: '隨機方向造成（0.2秒/次）傷害\n冷卻時間,持續時間,傷害,範圍,數量',
            },
            tornado: {
                title: '龍捲風',
                title2: '風暴',
                des: '隨機方向造成（0.2秒/次）傷害並捲入\n冷卻時間,傷害,範圍,數量,速度',
            },
        },

        passiveSkillInfo: {
            propRadius: {
                title: '拾取範圍',
            },
            SPD: {
                title: '移動速度',
            },
            ATK: {
                title: '攻擊力',
            },
            HP: {
                title: '生命上限',
            }
        }
    }
}

