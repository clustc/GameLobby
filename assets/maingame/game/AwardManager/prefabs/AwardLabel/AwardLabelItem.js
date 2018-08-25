cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.label = this.node.getComponent(cc.Label);
    },

    animateJump(cbk) { 
        var y = this.node.y;
        this.node.opacity = 255;
        this.node.runAction(cc.sequence(
            cc.moveTo(0.2, this.node.x, y + 40).easing(cc.easeSineOut()),
            cc.moveTo(0.2, this.node.x, y).easing(cc.easeSineIn()),
            cc.delayTime(1), cc.fadeOut(0.5),
            cc.callFunc(cbk)
        ))
    },

    animateFloat(cbk) {
        this.node.opacity = 0;
        this.node.runAction(cc.moveTo(1, this.node.x, this.node.y + 80).easing(cc.easeSineOut()));
        this.node.runAction(cc.sequence(cc.fadeIn(0.2),
            cc.delayTime(0.3), cc.fadeOut(0.5),
            cc.callFunc(cbk)
        ))
    }
});
