cc.Class({
    extends: cc.Component,

    properties: {
        cannolTitle: cc.Label,
        cannonIcon: cc.Sprite,
        cannonGiftAmount: cc.Label,
        // needDiamond: cc.Label,
        paoFrame: [cc.SpriteFrame],
        questionMask: cc.Node,
    },

    init(data) {
        this.data = data;
        this.cannolTitle.string = data.connonName;
        this.cannonGiftAmount.string = data.betAmount;
        this.cannonIcon.spriteFrame = this.paoFrame[this.getPaoType() - 1];

        var skinId = ff.AccountManager.cannonConfig.skinId;
        this.cannonIcon.spriteFrame = ff.ConstAssets.getCannonSkin(skinId);
        // this.needDiamond.string = data.diamond;
    },

    getPaoType() {
        //从1开始，炮台数组从0开始，所以记得减1
        if (this.data.grade <= 25) return 1;
        else if (this.data.grade <= 250) return 2;
        else return 3;
    },

    showQuestionMark() {
        this.questionMask.active = true;
        // this.needDiamond.node.active = false;
    },
    
    hideQuestionMark() {
        this.questionMask.active = false;
        // this.needDiamond.node.active = true;
    },
    // update (dt) {},
});
