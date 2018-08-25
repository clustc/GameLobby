cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad() {
        this.animation = this.node.getComponent(cc.Animation);
    },

    animateFly(startPos, finishPos, duration, delay, cbk) {
        this.animation.play();
        this.node.position = startPos;
        this.node.runAction(cc.sequence(
            cc.moveTo(0.3, startPos.x, startPos.y + 60).easing(cc.easeSineOut()),
            cc.moveTo(0.3, startPos.x, startPos.y).easing(cc.easeBackOut()),
            cc.delayTime(delay),
            cc.moveTo(duration, finishPos).easing(cc.easeQuinticActionIn()),
            cc.callFunc(cbk)
        ))
    },

    animateEmitFly(range, startPos, finishPos, duration, delay, cbk) {
        this.animation.play();
        this.node.position = startPos;
        this.node.runAction(cc.sequence(
            cc.moveTo(0.3, startPos.x, startPos.y + range * 1.3).easing(cc.easeSineInOut()),
            cc.jumpTo(0.5, startPos.x + Math.rand(-range, range), startPos.y + Math.rand(-range, range), 40, 1).easing(cc.easeSineIn()),
            cc.delayTime(delay),
            cc.moveTo(duration, finishPos).easing(cc.easeQuinticActionIn()),
            cc.callFunc(cbk)
        ))
    },
});
