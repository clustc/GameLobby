const Global = require('CCGlobal');
const UserVipConfig = require('UserVipConfig');
const UserSignConfig = require('UserSignConfig');
const UserTaskConfig = require('UserTaskConfig');
const UserRoomConfig = require('UserRoomConfig');
const UserShopConfig = require('UserShopConfig');
const UserPropsConfig = require('UserPropsConfig');
const UserSwitchConfig = require('UserSwitchConfig');
const UserCannonConfig = require('UserCannonConfig');
const MAX_PLAYER_LEVEL = 30;
const MAX_CANNON_LEVEL = 10000;

const AccountManager = cc.Class({

    extends: cc.EventTarget,

    properties: {
        vipConfig: { get() { return this._vipConfig; } },
        roomConfig: { get() { return this._roomConfig; } },
        propsConfig: { get() { return this._propsConfig; } },
        cannonConfig: { get() { return this._cannonConfig; } },
        taskConfig: { get() { return this._taskConfig; } },
        signConfig: { get() { return this._signConfig; } },
        shopConfig: { get() { return this._shopConfig; } },
        switchConfig: { get() { return this._switchConfig; } },

        coins: {
            get() { return this._coins; },
            set(v) {
                // if (this._coins != v) {
                //     this._coins = v;
                //     this.emit(this.EVENT_COINS_CHANGE);
                // }
                this._coins = v;
                this.emit(this.EVENT_COINS_CHANGE);
            },
        },
        jewels: {  //钻石数量
            get() { return this._jewels; },
            set(v) {
                if (this._jewels != v) {
                    this._jewels = v;
                    // this.emit(this.EVENT_JEWELS_CHANGE);
                }
            },
        },
        cannonLevel: { get() { return this._cannonLevel; } },
        playerLevel: { get() { return this._playerLevel; } },
        playerExps: { get() { return this._playerExps; } },
        upgradeExps: { get() { return this._upgradeExps; } },

        userId: { get() { return this._userId; } ,
                  set(v) {this._userId = v;}
            },
        userName: {     
            get() { return this._userName; },
            set(v) { this._userName = v; this.emit(this.EVENT_USERINFO_CHANGE) }
        },

        userHead: {
            get() { return this._userHead; },
            set(v) { this._userHead = v; this.emit(this.EVENT_USERINFO_CHANGE) }
        },
        nicknameFlag:{
            get() { return this._nicknameFlag; },
            set(v) { this._nicknameFlag = v; this.emit(this.EVENT_USERINFO_CHANGE) }
        },
        updateNickName: {
            get() { return this._updateNickName; },
            set(v) { this._updateNickName = v; }
        },

        sailPackage: {
            get() { return this._sailPackage; },
            set(v) { this._sailPackage = v; }
        },
        betAmount:{
            get(){return this._betAmount;},
            set(v){this._betAmount = v;}
        },

        vipLevel: { get() { return Math.max(this._vipLevel, this._timeLimitVipLevel); } },
        recharge: { get() { return this._recharge; } },
        preference: { get() { return this._preference; } },
        isVisitor: { get() { return this._isVisitor; } },
        isUserLogin: { get() { return this._isUserLogin; } },
        isPlayerLevelFull: { get() { return this._playerLevel == MAX_PLAYER_LEVEL; } },
        isCannonLevelFull: { get() { return this._cannonLevel == MAX_CANNON_LEVEL; } },

        EVENT_USER_LOGOUT: 'EVENT_USER_LOGOUT',
        EVENT_COINS_CHANGE: 'EVENT_COINS_CHANGE',
        EVENT_JEWELS_CHANGE: 'EVENT_JEWELS_CHANGE',
        EVENT_PROPS_CHANGE: 'EVENT_PROPS_CHANGE',
        EVENT_CANNON_UPGRADE: 'EVENT_CANNON_UPGRADE',
        EVENT_USERINFO_CHANGE: 'EVENT_USERINFO_CHANGE',
        EVENT_REFRESH_ACCOUNT: 'EVENT_REFRESH_ACCOUNT',
        EVENT_REFRESH_GOLDAMOUNT: 'EVENT_REFRESH_GOLDAMOUNT',

    },

    ctor() {
        this._betAmount = 0; //总的投注流水
        this._coins = 0;/**金币 */
        this._jewels = 0;/**钻石 */
        this._cannonLevel = 2;/**跑等级 */
        this._playerLevel = 0;/**玩家等级 */
        this._playerExps = 0;/**玩家经验 */
        this._upgradeExps = 0;/**升级所需经验 */
        this._userId = 0;/**玩家id */
        this._userName = '';/**玩家昵称 */
        this._userHead = '';/**玩家头像 */
        this._vipLevel = 0;/**vip等级 */
        this._isVisitor = false;/**是否游客 */
        this._isUserLogin = false;/**玩家是否登录 */
        this._recharge = 0;/**玩家充值金额 */
        this._nobleHead = false;/**是否是贵族头像框 */
        this._timeLimit = 0;/**	限时vip到期时间(秒) */
        this._timeLimitVipLevel = 0;/**限时vip等级 */
        this._preference = {};/**用户数据存储 */
        this._sailPackage = [];/**起航礼包奖励配置 */
        this._updateNickName = false;/**修改名称次数 */
        this._vipConfig = new UserVipConfig();
        this._roomConfig = new UserRoomConfig();
        this._propsConfig = new UserPropsConfig();
        this._cannonConfig = new UserCannonConfig();
        this._taskConfig = new UserTaskConfig();
        this._signConfig = new UserSignConfig();
        this._shopConfig = new UserShopConfig();
        this._switchConfig = new UserSwitchConfig();
    },

    refreshAccount() {
        cc.Linker('GetUserStatus').request(data => this.onRefreshAccount(data));
    },

    onGetToken(data, error) {
        if (data.accessToken) {
            Global.accessToken = data.accessToken;
            this._updateNickName = data.updateNickName;
            cc.Linker('GetUserStatus').request(data => this.onRefreshAccount(data), error);
        }
    },

    onRefreshAccount(data) {
        cc.log('enetr room     '+JSON.stringify(data))
        this.coins = data.coin;
        // this.jewels = data.diamond;
        // this._cannonLevel = data.batteryGrade; 
        this._cannonLevel = 100;
        this._playerLevel = data.level;
        this._playerExps = data.exp;
        this._upgradeExps = data.upgradeExp;
        this._userId = data.userId;
        this._userName = data.username;
        this._userHead = data.headImg;
        this._vipLevel = data.vipLevel;
        this._recharge = data.recharge;
        this._timeLimit = data.timeLimit;
        this._timeLimitVipLevel = data.timeLimitVipLevel || 0;
        this._nobleHead = data.nobleHead == 1;
        this._preference = JSON.parse(data.clientData || '{}');
        this._sailPackage = data.qihangLibaoGifts ? data.qihangLibaoGifts : [];
        this._isVisitor = data.visitor == 1;
        this._roomConfig.data = data.room;
        this._isUserLogin = true;
        this.emit(this.EVENT_REFRESH_ACCOUNT);
        this._signConfig.refreshData();
        this._taskConfig.refreshData();
        this._shopConfig.refreshData();
        this._switchConfig.refreshData(() => {
           
            // this._vipConfig.refreshData(() => {
            //     this._propsConfig.refreshData(() => {
            //         this._cannonConfig.refreshData(() => {
            //             this.emit(this.EVENT_REFRESH_ACCOUNT);
            //         });
            //     });
            // });
        });
        this._propsConfig.refreshData();
        this._cannonConfig.refreshData();
    },

    onPropertyChange(data) {
        data.detail && (data = data.detail);
        cc.log('onPropertyChange   '+JSON.stringify(data));
        var propertys = data.propertys;
        for (var i in propertys) {
            var p = propertys[i];
            if (p.propertyType == 1) {
                this.coins = this.coins + p.value;
            } else if (p.propertyType == 2) {
                this.jewels = p.value;
            } else if (p.propertyType == 3) {
                this._playerLevel = p.value;
                ff.AwardManager && ff.AwardManager.awardPopups.onLevelUpgrade(data.propInfos);
            } else if (p.propertyType == 4) {
                this._cannonLevel = p.value;
            }
        }
    },

    onPropsChange(data) {
        data.detail && (data = data.detail.props);
        this._propsConfig.onPropsChange(data);
        this.emit(this.EVENT_PROPS_CHANGE);
    },

    /**支付调用 */
    openPay(payData, success, failure) {
        cc.Proxy('gameOpenPay', payData, success, failure).called();
    },

    onIsCanBuy(payData, msg) {
        msg = msg || '您已购买过该礼包,请不要重复购买!'
        if (payData.nextTime && payData.nextTime > 0) {
            cc.Toast(msg).show();
            return false;
        } else {
            if (payData.buyFlag == 0) {
                cc.Toast('暂时不能购买该商品哦！').show();
                return false;
            }
            return true;
        }
    },

    setUserHeadImage(url, element) {
        var type;
        url = url || '';
        //console.log('setUserHeadImage    '+url);
        if (url.indexOf('http') != -1) {
            element && element.loadImage(url);
        }
        else {
            if (url == '' || !Number(url)) {
                type = 0;
            } else {
                type = Number(url) >= 12 ? 12 : Number(url);
            }
            element && (element.getComponent(cc.Sprite).spriteFrame = ff.ConstAssets.headImages[parseInt(type)]);
        }
        return type;
    },

    setUserHeadFrame(element, isFrame) {
        var type;
        isFrame = isFrame || this._nobleHead;
        if (isFrame) type = 1;
        else type = 0;
        element && (element.getComponent(cc.Sprite).spriteFrame = ff.ConstAssets.headFrames[type]);
        return type;
    }
});