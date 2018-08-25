cc.Class({
    extends: cc.Component,

    properties: {
        sendPrice: cc.Label,
        awardIcon: cc.Sprite,
        awardName: cc.Label,
        price: cc.Label,

        buyButton: cc.Button,
    },

    init(data) {
        if (!data) return;
        this.itemData = data;
        if (data.awardsList[0]) this.sendPrice.string = data.awardsList[0].awardsNum + data.awardsList[0].awardsName;
        this.awardIcon.loadImage(data.icon);
        this.awardName.string = data.name;
        this.price.string = '￥' + data.price;
    },

    onPay() {
        var isGold = this.itemData.awardsList[0].awardsType == 1;
        var param = {
            recharge_rmb: this.itemData.price,
            recharge_id: this.itemData.bizId,
            return_amount: isGold ? this.itemData.awardsList[0].awardsNum : undefined,
            diamond_amount: !isGold ? this.itemData.awardsList[0].awardsNum : undefined,
        };
        /**首页-商城-点击充值*/
        ff.BuryingPoint(3401020006, param);
        
        var isCanBuyFlag = ff.AccountManager.onIsCanBuy(this.itemData);
        if (!isCanBuyFlag) return;
        ff.AccountManager.openPay(this.itemData);
    },
});
