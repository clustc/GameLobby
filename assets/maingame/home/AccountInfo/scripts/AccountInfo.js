const CCGlobal = require('CCGlobal');
cc.Class({
    extends: cc.Component,

    properties: {
        playerFrame:cc.Sprite,
        playerIcon: cc.Sprite,

        userNickName: cc.Label,
        userGoldAmount: cc.Label,
        // userDiamondAmount: cc.Label,
        userId:cc.Label,
        bindAccountBtn: cc.Node,
        VipLevel: cc.Node,

        goldButton:cc.Node,
        // diamondButton:cc.Node,
    },


    onLoad() {
        ff.AccountManager.on('EVENT_REFRESH_ACCOUNT', this.setUserInfo, this);
        ff.AccountManager.on('EVENT_USERINFO_CHANGE', this.setUserInfo, this);
        ff.AccountManager.on('EVENT_COINS_CHANGE', this.setUserInfo, this);
        ff.AccountManager.on('EVENT_JEWELS_CHANGE', this.setUserInfo, this);
        this.setIsOpen();
        this.setUserInfo();
    },

    onDestroy() {
        ff.AccountManager.off('EVENT_REFRESH_ACCOUNT', this.setUserInfo, this);
        ff.AccountManager.off('EVENT_USERINFO_CHANGE', this.setUserInfo, this)
        ff.AccountManager.off('EVENT_COINS_CHANGE', this.setUserInfo, this);
        ff.AccountManager.off('EVENT_JEWELS_CHANGE', this.setUserInfo, this)
    },

    onOpenAccoundBindPop() {
        ff.BuryingPoint(3401000011);
        // cc.Popup('AccountBindPop').show();
        var isAudit = CCGlobal.isAudit;
        if(isAudit) cc.Popup('PhoneRegisterPop').show();
        else cc.Popup('AccountBindPop').show();
    },

    onGoldOpenShopPop() {
        ff.BuryingPoint(3401000006);
        cc.Popup('NewExchangePop').outsideClose(false).show();
        // this.openShop(0);
    },

    onDiamondOpenShopPop() {
        ff.BuryingPoint(3401000007);
        this.openShop(1);
    },

    onOpenBagPop() {
        if(!this.isOpenState[7].state) return;
        cc.Popup('BagPop').show();
    },

    openShop(flag) {
        ff.PopupManager.showShopPop(flag);
    },

    setUserInfo() {
        var data = ff.AccountManager;
        ff.AccountManager.setUserHeadFrame(this.playerFrame);
        ff.AccountManager.setUserHeadImage(data.userHead,this.playerIcon);
        this.userNickName.string = data.userName;
        this.userGoldAmount.string = data.coins;
        this.userId.string = data.userId;
        // this.userDiamondAmount.string = data.jewels;
        this.VipLevel.active = data.vipLevel ? true : false;
        this.bindAccountBtn.active = data.isVisitor;
    },

    setIsOpen(){
        var data = this.isOpenState = ff.AccountManager.switchConfig.data;
        // this.goldButton.active = data[2].state;
        // this.diamondButton.active =  data[2].state;
    },  


});
