cc.Class({
    extends: cc.Component,

    properties: {
        awardName: cc.Label,
        awardIcon: cc.Sprite,
        content: cc.Label,
        price: cc.Label,

        buyButton: cc.Button,
    },

    init(data) {
        if (!data) return;
        this.itemData = data;
        this.awardName.string = data.name;
        this.awardIcon.loadImage(data.icon);
        this.content.string = data.content;
        this.price.string = '￥' + data.price;
        this.buyButton.interactable = data.buyFlag === 1;
    },

    onPay() {
        this.node.emitEvent('close');
        ff.BuryingPoint(3401000010);
        cc.Popup('VipGiftPop').show();
    },
});
