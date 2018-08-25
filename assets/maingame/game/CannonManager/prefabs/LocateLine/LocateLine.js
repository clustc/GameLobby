cc.Class({
    extends: cc.Component,

    properties: {
        targetNode: cc.Node,
        lineSprite: cc.Node,
    },

    onLoad() {
        this.fish = null;
        this.targetNode.x = 100000;
        this.lineSprite.width = 0;
    },

    locateFish(fish) {
        if(fish) {
            this.updateLine(fish.node.position);
            if(fish !== this.fish) this.animTarget();
        } else {
            this.targetNode.x = 100000;
            this.lineSprite.width = 0;
        }
        this.fish = fish;
    },

    updateLine(pos) {
        var dx = pos.x - this.node.x;
        var dy = pos.y - this.node.y;
        this.targetNode.x = dx;
        this.targetNode.y = dy;
        this.lineSprite.rotation = -cc.radiansToDegrees(Math.atan2(dy, dx));
        this.lineSprite.width = Math.sqrt(dx * dx + dy * dy) - 40;
    },

    animTarget() {
        this.targetNode.stopAllActions();
        this.targetNode.setScale(8);
        this.targetNode.runAction(cc.scaleTo(0.3, 1).easing(cc.easeSineOut()))
    }
});
