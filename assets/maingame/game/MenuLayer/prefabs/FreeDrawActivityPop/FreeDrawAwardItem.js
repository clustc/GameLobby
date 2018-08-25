cc.Class({
    extends: cc.Component,

    properties: {
        awardName: cc.Label,
        awardIcon: cc.Sprite,
        awardAmount: cc.Label,
        awardAmountUnit: cc.Node,
    },

    initItem(data) {
        if (!data) return;
        var propData = ff.AccountManager._propsConfig.getPropById(data.id);
        this.awardName.string = propData.name;
        this.awardIcon.spriteFrame = propData.spriteFrame;
        var num;
        if (data.count >= 10000) {
            num = ((data.count / 1000) % 10) <= 0 ? Math.floor(data.count / 10000) + ':' : Math.floor(data.count / 10000) + ';' + Math.floor(data.count / 1000 % 10) + ':';
        }
        else {
            num = String(data.count).replace('.', ';');
        }
        this.awardAmount.string = num;
        this.awardAmountUnit.active = propData.propId === 3;
    },
});
