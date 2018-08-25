cc.Class({
    extends: cc.Component,

    properties: {
        propIcon: cc.Sprite,
        propCount: cc.Label,
    },

    init() {
        this.propCount && (this.propCount.string = '');
        cc.Sound.playSound('sGetJewel');
    },

    setIcon(spriteFrame) {
        this.propIcon.spriteFrame = spriteFrame;
        return this;
    },

    setCount(propNum) {
        this.propCount.string = propNum ? propNum : '';
        return this;
    },

    animateFly(startPos, finishPos, duration, delay, cbk) {
        this.init();
        this.node.position = startPos;
        this.node.scale = 0.4;
        this.node.runAction(cc.scaleTo(0.2, 1, 1).easing(cc.easeBackOut()));
        this.node.runAction(cc.sequence(
            cc.moveTo(0.2, startPos.x, startPos.y + 40).easing(cc.easeSineOut()),
            cc.moveTo(0.2, startPos.x, startPos.y).easing(cc.easeSineIn()),
            cc.delayTime(delay),
            cc.moveTo(duration, finishPos).easing(cc.easeQuinticActionIn()),
            cc.callFunc(cbk)
        ));
    }
});
