require('BuryingPoint');
require('PopupManager');
const Global = require('CCGlobal');
const AccountManager = require('AccountManager');

const GameManager = cc.Class({

    extends: cc.EventTarget,

    properties: {

    },

    ctor() {
        cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onGameHide, this);
    },

    onGameShow() {
        if (CC_EDITOR || cc.director.currentScene !== 'GameScene') return;
        ff.WSLinkManager && ff.WSLinkManager.onGameShow();
        ff.AccountManager && ff.AccountManager.refreshAccount();
    },

    onGameHide() {
        if (CC_EDITOR) return;
        ff.WSLinkManager && ff.WSLinkManager.onGameHide();
    },

    onGetToken(data) {
        if (!data.accessToken) return;
        Global.accessToken = data.accessToken;
        ff.AccountManager = new AccountManager();

        if(cc.director.getScene().name != "GameLobbyScene"){
            cc.director.loadScene('GameLobbyScene');
        }

        if(typeof CacheData != 'undefined'){
            let instance = CacheData.getInstance();
            let loginData = JSON.stringify(data);
            cc.log("====> login data : ", loginData);
            instance.set("login_data", loginData);
        }
        
    },

    

    /**进入指定房间 */
    enterGameRoom(enterRoomId, selectRoomId) {
        var roomConfig = ff.AccountManager.roomConfig;
        /**除了第一个房间，其他房间需要进行金币判断 */
        // if (roomConfig.getRoomOrderById(enterRoomId) !== 0) {
        //     /**作金币判断 */
        //     var enterMinMoney = roomConfig.getRoomConfigById(enterRoomId).enterMinMoney;
        //     if (enterMinMoney > ff.AccountManager.coins) {
        //         return cc.Toast('您的金币不足' + enterMinMoney + '，去其他房间看看吧').show();
        //     }
        // }
        var enterMinMoney = roomConfig.getRoomConfigById(enterRoomId).enterMinMoney;
        if (enterMinMoney > ff.AccountManager.coins) {
            // return cc.Toast('您的金币不足' + enterMinMoney + '，去其他房间看看吧').show();
            if (ff.AccountManager.coins < 100){
                return cc.Popup('NewExchangePop').outsideClose(false).show();
            }
            return cc.Toast('您的金币不足' + enterMinMoney + '，去其他房间看看吧').show();
        }
        roomConfig.enterRoomId = enterRoomId;
        if (selectRoomId) {
            roomConfig.selectRoomId = selectRoomId;
            this.loadScene('GameScene');
        } else {
            roomConfig.selectRoomId = 0;
            this.loadWSUrl(() => this.loadScene('GameScene'));
        }
    },

    loadWSUrl(okCbk) {
        ff.ConstAssets.loadFishValues(() => {
            cc.Linker('GetWebSocketUrl', {
                gameType: Global.appInfo.gameId
            }).showLoading(true).request(data => {
                if (data.ws) {
                    Global.websocketUrl = data.ws;
                    okCbk && okCbk();
                } else cc.Toast('获取房间入口失败').show();
            });
        });
    },

    /**加载场景 */
    loadScene(name) {

        var percent = 0;
        var Tips = ['收集足够话费，可以到合成页面进行合成话费大奖哦！', '金币不仅能捕鱼，还能兑换话费和京东卡！', '不要小瞧话费鱼，个小料不少！']
        cc.loader.onProgress = function (complete, total, item) {
            var rate = complete / total;
            if (rate > percent) {
                percent = rate;
                cc.Transfer.setProgress(percent);
            }
        };
        cc.Popup.clearPopups();
        cc.Transfer.show();
        // cc.Transfer.setText(Tips[Math.rand(0, Tips.length - 1)]);
        cc.director.loadScene(name, () => (name !== 'GameScene') && cc.Transfer.hide());
    },

    /**游戏内埋点 */
    buryingPoint(type, cbk) {
        // cc.BaseLinker('BuryingPoint', {
        //     buryingType: type,
        //     gameType: Global.appInfo.gameId,
        // }).request(cbk, cbk);
    },

    /**存取设置 */
    setItem(key, value) {
        ff.AccountManager.preference[key] = value;
        var save = JSON.stringify(ff.AccountManager.preference);
        cc.BaseLinker('UserPreference', { content: save }).request();
    },

    getItem(key) {
        var value = ff.AccountManager.preference[key];
        return value == undefined ? '' : value + '';
    }
});

ff.GameManager = new GameManager();