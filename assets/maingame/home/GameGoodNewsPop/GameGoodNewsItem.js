
cc.Class({
    extends: cc.Component,

    properties: {
        itemIcon: cc.Sprite,
        itemIconFrame: [cc.SpriteFrame],
        message: cc.RichText,
    },

    initItem(data) {
        this.itemIcon.spriteFrame = this.itemIconFrame[data.type - 1] ? this.itemIconFrame[data.type - 1] : this.itemIconFrame[1];
        this.message.string = data.content;
    },
});
