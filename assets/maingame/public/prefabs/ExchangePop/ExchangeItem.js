cc.Class({
    extends: cc.Component,

    properties: {
        flag: cc.Sprite,
        flagFrame: [cc.SpriteFrame],
        awardName: cc.Label,
        awardIcon: cc.Sprite,
        price: cc.Label,
        buyBtn: cc.Button,
    },

    onLoad() {

    },

    init(data) {
        if (!data) return;
        this.itemData = data;
        this.awardName.string = data.awardsList[0].awardsName;
        this.awardIcon.loadImage(data.awardsList[0].awardsImage);
        this.index = Number(data.cornerDesc) || 1;
        this.flag.spriteFrame = this.flagFrame[this.index - 1];

        var str = data.content.split('+');
        this.gold_price = str[1].split('W');
        this.price.string = this.gold_price[0] + 'W+' + str[0];
    },

    onBuy() {
        /**首页-兑换页面-奖励兑换*/
        ff.BuryingPoint(3401060003, {
            recharge_id: this.itemData.bizId
        });

        if (this.index >= 3) {
            cc.Toast('商品暂缺，暂时无法兑换哦！').show();
            return;
        }

        if (ff.AccountManager.isVisitor) {
            cc.Toast('游客状态无法兑换哦！').show();
            return;
        }

        if (ff.AccountManager.coins < (Number(this.gold_price[0]) * 10000)) {
            cc.Toast('金币不足，无法兑换哦！').show();
            return;
        }

        ff.AccountManager.openPay(this.itemData);
    },
});
