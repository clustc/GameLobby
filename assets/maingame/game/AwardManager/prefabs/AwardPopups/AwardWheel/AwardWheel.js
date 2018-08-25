cc.Class({
    extends: cc.Component,

    properties: {
        animation: cc.Animation,
        coinsLabel: cc.Label,
        nameImage: cc.Sprite,
    },

    show(name, coins) {
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.1));
        this.animation.play();
        this.coinsLabel.string = coins;
        this.nameImage.spriteFrame = ff.ConstAssets.fishNameImages[name];
    }
});
