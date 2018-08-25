cc.Class({
    extends: cc.Component,

    properties: {
        awardIcon: cc.Sprite,
        awardAmount: cc.Label,
    },

    init(data) {
        this.awardIcon.spriteFrame = ff.AccountManager.propsConfig.getPropById(data.propId).spriteFrame;
        this.awardAmount.string = data.propId == 3 ? ':' + (data.propNum / 10) : ':' + data.propNum;
    },
});
