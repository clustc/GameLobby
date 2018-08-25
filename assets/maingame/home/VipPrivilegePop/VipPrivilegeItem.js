cc.Class({
    extends: cc.Component,

    properties: {
        vipLevel: cc.Label,
        limitTime: cc.Node,
        cannnonIcon: cc.Sprite,
        cannonName: cc.Sprite,
        receivedIcon: cc.Node,
        rechargeAmount: cc.Label,
    },

    init(data) {
        var cfg = ff.AccountManager.vipConfig.getConfigByVipLevel(data.vipLevel);
        if (!cfg) return;

        this.vipLevel.string = data.vipLevel;
        this.cannnonIcon.spriteFrame = cfg.spriteFrame;
        this.cannonName.spriteFrame = cfg.nameSpriteFrame;

        if (data.vipLevel <= ff.AccountManager.vipLevel) {
            if (data.vipLevel <= ff.AccountManager._vipLevel) this.limitTime.active = false;
            else if (data.vipLevel <= ff.AccountManager._timeLimitVipLevel) this.limitTime.active = true;

            this.rechargeAmount.node.parent.active = false;
            this.receivedIcon.active = true;
            this.node.setCascadeColor(cc.color(255, 255, 255));
        }
        else {
            this.limitTime.active = false;
            this.rechargeAmount.node.parent.active = true;
            this.receivedIcon.active = false;
            this.rechargeAmount.string = '累计充值' + data.recharge + '元';
            this.node.setCascadeColor(cc.color(150, 150, 150));
        }
    },
});
