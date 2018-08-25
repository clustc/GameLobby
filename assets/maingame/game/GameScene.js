cc.Class({
    extends: cc.Component,

    properties: {
        fishManager: require('FishManager'),
        bulletManager: require('BulletManager'),
        cannonManager: require('CannonManager'),
        awardManager: require('AwardManager'),
        effectManager: require('EffectManager'),
        controlManager: require('ControlManager'),
    },

    onLoad() {
        var room = ff.AccountManager.roomConfig;
        this.node.getComponent(cc.Canvas).setSceneMusic('mGameRoom' + room.getRoomOrderById(room.enterRoomId));
        this.node.addComponent('BeatHttpLink');
        ff.FishManager = this.fishManager;
        ff.BulletManager = this.bulletManager;
        ff.CannonManager = this.cannonManager;
        ff.AwardManager = this.awardManager;
        ff.EffectManager = this.effectManager;
        ff.ControlManager = this.controlManager;
        ff.WSLinkManager = this.node.addComponent('WebSocketLink');
        ff.WSLinkManager.on('EnterRoomMsg', this.onEnterRoomMsg, this);
        ff.WSLinkManager.on('PropsChangeMsg', ff.AccountManager.onPropsChange, ff.AccountManager);
        ff.WSLinkManager.on('PropertyChangeMsg', ff.AccountManager.onPropertyChange, ff.AccountManager);
    },

    onDestroy() {
        delete ff.UpdateTimer;
        delete ff.FishManager;
        delete ff.BulletManager;
        delete ff.CannonManager;
        delete ff.AwardManager;
        delete ff.EffectManager;
        delete ff.ControlManager;
        delete ff.WSLinkManager;
    },

    onEnterRoomMsg(event) {
        this.scheduleOnce(() => cc.Transfer.hide(), 0);
        //请求总流水
        cc.Linker('TotalBetAmount').request(data => {
            cc.log('TotalBetAmount   '+JSON.stringify(data));
            ff.AccountManager.betAmount = data.betAmount;
        });
    },
});
