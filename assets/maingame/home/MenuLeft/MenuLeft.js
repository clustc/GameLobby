cc.Class({
    extends: cc.Component,

    properties: {
        FirstChargeBtn:cc.Node,
        SpecialShopButton:cc.Node,
        AristocratPackageButton:cc.Node,
        VIPPrivilegeButton:cc.Node,
    },

    onLoad () {
        this.isShowState = ff.AccountManager.switchConfig.data;
        ff.AccountManager.on('EVENT_REFRESH_ACCOUNT',this.initShopIcon,this);
        this.initShowState();
    },

    onDestroy(){
        ff.AccountManager.off('EVENT_REFRESH_ACCOUNT',this.initShopIcon,this)
    },

    initShowState(){
        var data = this.isShowState;
        // this.AristocratPackageButton.active = data[3].state;
        // this.VIPPrivilegeButton.active = data[4].state;
        this.initShopIcon();
    },

    initShopIcon(){
        // var state_1 = this.isShowState[1].state;
        // var state_2 = this.isShowState[2].state;
        // if(ff.AccountManager.recharge == 0 && state_1){
        //     this.FirstChargeBtn.active = true;
        //     this.SpecialShopButton.active = false;
        // }else if(state_2){
        //     this.FirstChargeBtn.active = false;
        //     this.SpecialShopButton.active = true;
        // }else{
        //     this.SpecialShopButton.active = false;
        //     this.FirstChargeBtn.active = false;
        // }
    },

    onOpenShop() {
        ff.BuryingPoint(3401010001);
        ff.PopupManager.showShopPop();
    },

    onVipPrivilege() {
        ff.BuryingPoint(3401000009);
        cc.Popup('VipPrivilegePop').show();
    },

    onOpenVipGift() {
        ff.BuryingPoint(3401000010);
        cc.Popup('VipGiftPop').show();
    },

});
