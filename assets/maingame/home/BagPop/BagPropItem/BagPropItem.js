const ITEM_AMOUNT = '<outline width=1 color=#208DDF>{0}</outline>'
cc.Class({
    extends: cc.Component,

    properties: {
        propItemFrame: cc.Sprite,
        ItemAmount: cc.Label,

        propBg: cc.Sprite,
        propFrame: [cc.SpriteFrame],
    },

    onLoad() {
    },

    initItem(data) {
        if (!data) return;
        this.ItemAmount.string = data.propNum;
        this.propItemFrame.spriteFrame = ff.AccountManager.propsConfig.getPropById(data.propId).spriteFrame;
        this.setUnselectedFrame();
        this.propItemFrame.node.active = true;
    },

    setUnselectedFrame() {
        this.propBg.spriteFrame = this.propFrame[0];
    },
    setSelectedFrame() {
        this.propBg.spriteFrame = this.propFrame[1];
    },

    refreshPropItemAmount() {
        this.ItemAmount.string = data.propNum;
    },
});
