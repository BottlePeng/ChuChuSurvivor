import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('en')
export class en {
    data = {
        app_name: 'MagicBrother',
        ios_app_name: 'MagicBrother',
        android_app_name: 'MagicBrother',

        error_action: 'operation failed',
        error_chip: 'lack of chip',
        error_gold: 'lack of gold',
        error_role: 'role error',
        error_timeout: 'timeout',
        error_ad: 'suitable ad. Please try again later',
        error_ad_ready: 'ad is not ready',
        error_equipNum: 'lack of Equip Chest',
        error_cd: 'Cooling',
        error_revive: 'lack of revive',
        error_equip_level: 'Cannot exceed the current level',
        error_version: 'new version available\nClick to exit and restart the game?',
        error_guest: 'Tourists are prohibited from operating',
        error_data: 'data error',
        error_length: 'length %{length} character',
        error_sid_friendSid: 'Cannot input ones own ID',
        error_sid_max: 'Maximum binding quantity',
        error_sid_self: 'The ID has been bound by you',
        error_select_role: 'Cannot select heroes that are not owned',
        error_no_upLevel: 'nothing that can be upgraded',

        success_action: 'success',
        success_uploadData: 'Upload successful',
        success_upLevel: 'Upgrade successful',
        success_buy: 'Purchase successful',
        success_gain: 'Successfully obtained',
        success_revive: 'Resurrected successfully',

        adRequestTrackingAuthorizationTip: 'In order to obtain advertising rewards normally in the game, please agree to our use of the device [identifier]\nThis identifier is only used for normal game ad pulling',

        loading: 'Loading',

        login_guest: 'Sign in with Guest',
        login_qq: 'Sign in with QQ',
        login_taptap: 'Sign in with TapTap',
        login_apple: 'Sign in with Apple',
        login_out: 'Logout',

        delete_data: 'Delete data',
        exitGame: 'Exit game',

        sid: 'ID',
        copy: 'copy',
        input: 'input',

        doc_user: 'User Agreement',
        doc_privacy: 'Privacy Policy',
        reportToAdmin: 'Problem feedback',

        uploadData: 'upload data',
        never: 'never',

        yes: 'YES',
        close: 'CLOSE',
        agree: 'agree',
        refuse: 'refuse',

        guestLoginTips: 'Tourist mode cannot save in the cloud\nDo you want to enter the game?',
        sidTip: 'Enter your friend ID to receive rewards',
        playDayTip: 'Accompanying you %{day} day',
        roleHelpTip: 'Purchase or upgrade other characters to selected heroes\n[+2 health] or [+1 attack]',
        skillHelpTip: 'Upgrade skills to selected heroes\n[+1 health] or [+0.5 attack]',
        deleteDataTip: 'Delete local and server data\ndo you want to continue?',
        reportToAdminTip: 'Please let us know the problem you have encountered',

        gameCenterSignTip: 'Not logged in to GameCenter\nDo you want to open it in your phone settings?',
        gameCenterSend: 'Send',

        frameRate: 'frame rate',
        startGame: 'Start Game',

        notHave: 'Not owned',

        get: 'GET',
        canGain: 'Can be claimed',
        buy: 'buy',
        select: 'select',
        upLevel: 'upgrade',
        allUpLevel: 'All UP',
        gain: 'obtain',
        allGain: 'Get All',

        continue: 'continue',
        exit: 'exit',
        revive: 'revive',

        noAttr: 'No attributes',
        noEquip: 'No equip',
        currentEquip: 'Current',
        all: 'All',
        condition: 'condition',

        sell: 'Sell',
        equip: 'Equip',
        hero: 'Hero',
        skill: 'Skill',
        achive: 'Achive',
        hurt: 'Hurt',
        dps: 'DPS',

        ATKPencent: 'ATK',
        HPPencent: 'HP',
        critOdds: 'crit',
        doubleOdds: 'double',

        audioMusic: 'music',
        audioEffect: 'effect',

        fightLevel: 'Lv %{level}',

        total: 'Total',
        done: 'Done',
        achiveInfo: {
            lookAd: {
                video: 'Look Ad'
            },
            gainProp: {
                gold: 'Gain gold in fight',
                equipNum: 'Gain equip box in fight',
            },
            useRole: 'Use hero clearance',
            useSkill: 'Use skill in fight',
            usePassiveSkill: 'Up to full in fight',
        },
        skillFightUplevel: 'Battle Upgrade',
        skillInfo: {
            hole: {
                title: 'abyss',
                title2: 'endless',
                des: 'Deals (0.5 seconds/time) damage to enemies within range\nDamage,Range',
            },
            fireBall: {
                title: 'fireball',
                title2: 'Apocalypse',
                des: 'Attack the nearest target and repel it\nCD,damage,range,quantity,penetration',
            },
            sword: {
                title: 'sword',
                title2: 'HolySword',
                des: 'Surround and deal damage to enemies while repelling (blocking bullets)\nCD,damage,range,quantity,duration',
            },
            dart: {
                title: 'Darts',
                title2: 'WindDemon',
                des: 'Launch multiple attacks on the nearest target\nCD,damage,range,quantity,penetration',
            },
            drug: {
                title: 'venom',
                title2: 'HighlyToxic',
                des: 'Generate at random locations and deal (0.2 seconds/time) to enemies\ndamage,range,quantity,duration',
            },
            stony: {
                title: 'Meteorite',
                title2: 'meteor',
                des: 'Surround and deal damage to enemies while repelling (blocking bullets)\nCD,duration,damage,range,quantity,speed',
            },
            magicBall: {
                title: 'Energy sphere',
                title2: 'MagicBall',
                des: 'Attack the nearest enemy\nCD,damage',
            },
            lightning: {
                title: 'lightning',
                title2: 'Benlei',
                des: 'Attack random targets and explode (with 50% damage)\nCD,damage,range,quantity',
            },
            boomerang: {
                title: 'Boomerang ',
                title2: 'StrongBoomerang',
                des: 'Attack random targets and return\nCD,damage,range',
            },
            bomb: {
                title: 'bomb',
                title2: 'Explosive bomb',
                des: 'Attack random target explosion causing range damage\nCD,damage,range',
            },
            ice: {
                title: 'Ice Arrow',
                title2: 'Ice breaking',
                des: 'Attack random targets and freeze\nCD,duration,damage,quantity,penetration',
            },
            knive: {
                title: 'HalfMoonSlash',
                title2: 'MoonSlash',
                des: 'Attack the nearest target and penetrate (block bullets)\nCD,damage,range,quantity',
            },
            gem: {
                title: 'gemstone',
                title2: 'bright',
                des: 'Attack the nearest target and reflect at the edge of the field of view (lasting for 5 seconds)\nCD,damage,quantity',
            },
            laser: {
                title: 'laser',
                title2: 'Superenergy',
                des: 'Random direction causes (0.2 seconds/time) damage\nCD,duration,damage,range,quantity',
            },
            tornado: {
                title: 'tornado',
                title2: 'storm',
                des: 'Causing (0.2 seconds/time) damage in random directions and getting involved in\nCD,damage,range,quantity,speed',
            },
        },

        passiveSkillInfo: {
            propRadius: {
                title: 'PickingRegion',
            },
            SPD: {
                title: 'MoveSpeed',
            },
            ATK: {
                title: 'ATK',
            },
            HP: {
                title: 'Max HP',
            }
        }
    }
}

