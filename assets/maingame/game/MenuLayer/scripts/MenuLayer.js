cc.Class({
    extends: cc.Component,

    properties: {
        playerGuide: cc.Prefab,
        drawerMenu: cc.Prefab,
        unlockPanel: cc.Prefab,
        newbieTaskPanel: cc.Prefab,
        horseRaceLamp: cc.Prefab,
        freeDrawPanel: cc.Prefab,
        guidePiecesTips: cc.Prefab,
        shopButton: cc.Node,
        firstCharge: cc.Node,
        tomorrowButton: cc.Node,

        shopFrame: [cc.SpriteFrame],
    },

    onLoad() {
        this.freeDrawPanel = this.initLayer(this.freeDrawPanel, 29);
        this.unlockPanel = this.initLayer(this.unlockPanel, 28);
        this.drawerMenu = this.initLayer(this.drawerMenu);
        this.horseRaceLamp = this.initLayer(this.horseRaceLamp, 33);
        this.guidePiecesTips = this.initLayer(this.guidePiecesTips);

        var data = ff.AccountManager.switchConfig.data;
        var node = cc.instantiate(this.playerGuide);
        node.once('start-task', () => data[27].state && this.node.addChild(cc.instantiate(this.newbieTaskPanel)));
        this.node.addChild(node);

        // this.tomorrowButton.active = data[30].state;
        // this.shopButton.active = data[2].state;

        // this.shopButton.on('click', () => {
        //     var enterRoomId = Number(ff.AccountManager.roomConfig.enterRoomId);
        //     var channelId = String(require('CCGlobal').appChannel);

        //     if (channelId.indexOf('300001') != -1) {
        //         cc.Popup('ShopPop').show((node) => node.init(0));
        //     } else {
        //         if (enterRoomId == 101) cc.Popup('ShopPop').show((node) => node.init(0));
        //         else {
        //             /*游戏-炮升级礼包 */
        //             ff.BuryingPoint(3402000023);
        //             cc.Popup('GameChargePop').outsideClose(false).show();
        //         }
        //     }
        // });

        // this.firstCharge.on('click', () => {
        //     /*游戏-一元礼包 */
        //     ff.BuryingPoint(3402000022);
        //     cc.Popup('FirstChargePop').show();
        // });

        this.initView();
        // this.initShop();
        ff.AccountManager.on('EVENT_REFRESH_ACCOUNT', this.initView, this);
    },

    onDestroy() {
        ff.AccountManager.off('EVENT_REFRESH_ACCOUNT', this.initView, this);
    },

    initLayer(prefab, index) {
        var data = ff.AccountManager.switchConfig.data;
        if (index && !data[index].state) return;
        var p = cc.instantiate(prefab);
        this.node.addChild(p);
        return p;
    },

    initView() {
        // this.firstCharge.active = !(ff.AccountManager.recharge > 0);
    },

    initShop() {
        // var enterRoomId = Number(ff.AccountManager.roomConfig.enterRoomId);
        // if (enterRoomId == 101) return this.shopButton.getComponent(cc.Sprite).spriteFrame = this.shopFrame[0];;
        // this.shopButton.getComponent(cc.Sprite).spriteFrame = this.shopFrame[enterRoomId];
        // this.shopButton.children[0].active = true;
    },
});
