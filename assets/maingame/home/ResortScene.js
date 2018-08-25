cc.Class({
    extends: cc.Component,

    properties: {
        resortSettingBtn:cc.Prefab,
        resortMenu:cc.Prefab,
        accountInfo: cc.Prefab,
    },

    onLoad() {
        this.accountInfo = this.initLayer(this.accountInfo);
        this.resortSettingBtn = this.initLayer(this.resortSettingBtn);
        this.resortMenu = this.initLayer(this.resortMenu);

        this.accountInfo.getScript().setUserInfo();
    },

    initLayer(prefab) {
        var p = cc.instantiate(prefab);
        this.node.addChild(p);
        return p;
    },
});
