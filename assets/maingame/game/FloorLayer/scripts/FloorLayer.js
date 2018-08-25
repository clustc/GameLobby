cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Node,
        backgrounds: [cc.SpriteFrame]
    },

    onLoad() {
        var room = ff.AccountManager.roomConfig;
        var order = room.getRoomOrderById(room.enterRoomId);
        this.node.getComponent(cc.Sprite).spriteFrame = this.backgrounds[order * 2 + 1];
        this.background.getComponent(cc.Sprite).spriteFrame = this.backgrounds[order * 2];
    },

    changing() {
        if(this.background.opacity === 0) this.background.runAction(cc.fadeIn(3));
        else if(this.background.opacity === 255) this.background.runAction(cc.fadeOut(3));
    }
});
