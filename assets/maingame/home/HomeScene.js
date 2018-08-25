cc.Class({
    extends: cc.Component,

    properties: {
        accountInfo: cc.Prefab,
        settingButton: cc.Prefab,
        roomScroll: cc.Prefab,
        menuLeft: cc.Prefab,
        // menuRight: cc.Prefab,
        menuBottom: cc.Prefab,
        playButton: cc.Prefab,
        horseRaceLamp: cc.Prefab,
    },

    onLoad() {
        this.node.addComponent('BeatHttpLink');
        this.node.getComponent(cc.Canvas).setSceneMusic('mHomeScene');
        this.roomScroll = this.initLayer(this.roomScroll);
        this.accountInfo = this.initLayer(this.accountInfo);
        this.settingButton = this.initLayer(this.settingButton);
        this.menuLeft = this.initLayer(this.menuLeft);
        // this.menuRight = this.initLayer(this.menuRight);
        this.menuBottom = this.initLayer(this.menuBottom);
        this.playButton = this.initLayer(this.playButton, 25);
        this.horseRaceLamp = this.initLayer(this.horseRaceLamp, 33);
        this.onSailPackagePop();
        this.initHorseLamp();

        /*进入首页*/
        ff.BuryingPoint(3401000001, {
            room_level: ff.AccountManager.roomConfig.defaultRoomId
        });
    },

    initLayer(prefab, index) {
        var data = ff.AccountManager.switchConfig.data;
        if (index && !data[index].state) return;
        var p = cc.instantiate(prefab);
        this.node.addChild(p);
        return p;
    },

    onSailPackagePop() {
        ff.PopupManager.sailPackagePop();
    },

    initHorseLamp() {
        this.isShowHorseLamp = ff.GameManager.getItem('isHorseLamp') === 'false' ? false : true;
        this.setHorseLamp(this.isShowHorseLamp);
    },

    setHorseLamp(data) {
        if (this.isShowHorseLamp == data) return;
        ff.GameManager.setItem('isHorseLamp', data);
        this.isShowHorseLamp = data;
        this.horseRaceLamp.getScript().setHorseLamp(data);
    },
});
