cc.Class({
    extends: cc.Component,

    properties: {
        awardIcon: cc.Sprite,
        awardAmount: cc.Label,
    },

    init(data) {
        this.awardIcon.spriteFrame = ff.AccountManager.propsConfig.getSpriteByName(data.name);
        this.awardAmount.string = ':' + data.amount;
    }
});
