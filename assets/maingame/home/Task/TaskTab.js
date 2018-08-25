cc.Class({
    extends: cc.Component,

    properties: {
        sptTxt : cc.Node,
        disableSptFrame : cc.SpriteFrame,
        normalSptFrame : cc.SpriteFrame,
    },

    onLoad() {
        this.btnComp = this.node.getComponent(cc.Button);
        this.sptTxtComp = this.sptTxt.getComponent(cc.Sprite);
    },

    update (dt) {
        var inter = this.btnComp.interactable
        if (inter === true) {
            this.sptTxtComp.spriteFrame = this.normalSptFrame;
        }else {
            this.sptTxtComp.spriteFrame = this.disableSptFrame;
        }
    },
});
