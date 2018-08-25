const ITEM_COUNT = 4;
cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: cc.Prefab,
        itemContainer: cc.Node,
        contain: cc.Node,
    },

    //====================================================================================================
    //** */
    //====================================================================================================
    onLoad() {
        this.node.getChildByName('btn_get').on('click', this.OnGetBtnClicked, this);
        this.GetMsg();
    },

    //====================================================================================================
    //** */
    //====================================================================================================
    onDestroy() {
    },

    //====================================================================================================
    //** */
    //====================================================================================================
    OnGetBtnClicked(event) {
        if (!this._itemData) { return; }
        ff.BuryingPoint(3401030001);
        var isCanBuyFlag = ff.AccountManager.onIsCanBuy(this._itemData, '您已经购买过贵族礼包，请不要重复购买');
        if (!isCanBuyFlag) return;
        ff.AccountManager.openPay(this._itemData);
    },

    //====================================================================================================
    //** */
    //====================================================================================================
    GetMsg() {
        ff.AccountManager.shopConfig.refreshVipGiftDataData((data) => {
            this.DoMsg(data);
        }, 'isLoading')
    },

    //====================================================================================================
    //** */
    //====================================================================================================
    DoMsg(data) {
        if (data.length > 0) {
            var count = 0;
            this._itemData = data[0];
            this._id = data[0].bizId;
            var awardsList = data[0].awardsList;
            for (var i = 0; i < awardsList.length; i++) {
                count++;
                if (count > ITEM_COUNT) {
                    var itemContain = cc.instantiate(this.itemContainer);
                    itemContain.removeAllChildren();
                    this.contain && this.contain.addChild(itemContain)
                    count = 0;
                }

                var item = cc.instantiate(this.itemPrefab);
                var data = awardsList[i];

                var sptComp = item.getChildByName('spt_item').getComponent(cc.Sprite);
                sptComp && sptComp.loadImage(data.awardsImage);

                var lblComp = item.getChildByName('lbl_name').getComponent(cc.Label);
                var txt = data.awardsName + '×' + data.awardsNum + (data.sendType === 2 ? '/天' : '');
                lblComp && (lblComp.string = txt);

                var parent = this.contain.children[this.contain.children.length - 1];
                parent && parent.addChild(item)
            }
        }
    }
    //====================================================================================================
    //** */
    //====================================================================================================

});
