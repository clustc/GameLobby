cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Sprite,
        animation: cc.Animation,
    },

    init(bullet) {
        if(bullet.locateFish) this.node.position = bullet.locateFish.node.position;
        else this.node.position = bullet.node.position;
        this.sprite.spriteFrame = bullet.fishnetSkin;
        this.animation.play();
    }
});
