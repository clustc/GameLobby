cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.RichText,
    },

    init(leve, room, roomNext) {
        var str = this.text.string.replace('level', leve);
        str = str.replace('room1', room);
        str = str.replace('room2', roomNext);
        this.text.string = str;
        this.node.stopAllActions();
        this.node.opacity = 255;
        this.node.runAction(cc.sequence(
            cc.delayTime(3),
            cc.fadeOut(0.5),
            cc.callFunc(() => this.node.x = 10000)
        ))
    },
});
