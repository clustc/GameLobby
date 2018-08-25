cc.Class({
    extends: cc.Component,

    properties: {
        packageArr: [cc.Node],
    },

    onLoad() {
        var url = require('GameUrls').GetRoomMail + '/' + ff.AccountManager.roomConfig.enterRoomId;
        cc.Linker(url).showLoading(true).request((data) => {
            this.itemData = data;
            this.initView(data);
        })
    },

    initView(msg) {
        for (var i = 0; i < this.packageArr.length; i++) {
            var key = i == 0 ? 'diamond' : 'gold';
            if (!msg[key] || !msg) continue;

            var data = msg[key][0];
            var package_price = this.packageArr[i].find('price/price_count');
            package_price.getComponent(cc.Label).string = data.price;

            if (data.cornerDesc && data.cornerDesc.indexOf('originPrice') !== -1) {
                var old_price = JSON.parse(data.cornerDesc);
                this.packageArr[i].getChildByName('old_price').active = true;
                var package_old_price = this.packageArr[i].find('old_price/old_price_amount/old_price_count');
                package_old_price.getComponent(cc.Label).string = String(old_price.originPrice).replace('.', ':');
            } else {
                this.packageArr[i].getChildByName('old_price').active = false;
            }

            var itemArr = this.packageArr[i].getChildByName('content').children;
            for (var j = 0; j < itemArr.length; j++) {
                if (!data.awardsList[j]) continue;

                var icon_img = itemArr[j].find('item_img');
                icon_img.getComponent(cc.Sprite).loadImage(data.awardsList[j].awardsImage);

                var isFirstAward = j == 0;
                if (isFirstAward) {
                    var price_count = itemArr[j].find('item_price/item_count');
                    price_count.getComponent(cc.Label).string = ':' + data.awardsList[j].awardsNum;
                }
                else {
                    var price_count = itemArr[j].getChildByName('item_count');
                    price_count.getComponent(cc.Label).string = data.awardsList[j].awardsName + 'x' + data.awardsList[j].awardsNum;
                }
            }
        }
    },

    onBuyCannonPackage() {
        /*游戏-炮升级礼包-购买金币 */
        ff.BuryingPoint(3402050001, {
            recharge_rmb: this.itemData['diamond'][0].price,
            recharge_id: this.itemData['diamond'][0].bizId,
        });
        var isCanBuyFlag = ff.AccountManager.onIsCanBuy(this.itemData['diamond'][0], '该礼包每日限购一次，请不要重复购买！');
        if (!isCanBuyFlag) return;
        ff.AccountManager.openPay(this.itemData['diamond'][0]);
    },

    onBuyGoldPackage() {
        /*游戏-炮升级礼包-购买钻石 */
        ff.BuryingPoint(3402050002, {
            recharge_rmb: this.itemData['gold'][0].price,
            recharge_id: this.itemData['gold'][0].bizId,
        });
        var isCanBuyFlag = ff.AccountManager.onIsCanBuy(this.itemData['gold'][0], '该礼包每日限购一次，请不要重复购买！');
        if (!isCanBuyFlag) return;
        ff.AccountManager.openPay(this.itemData['gold'][0]);
    },

    onClosePop() {
        /*游戏-炮升级礼包-关闭 */
        ff.BuryingPoint(3402050003);
        this.node.emit('close');
        cc.Popup('ShopPop').show((node) => node.init(0));
    },
});
