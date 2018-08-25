cc.Class({
    extends: cc.Component,

    properties: {
        contain: cc.Node,
    },

    //====================================================================================================
    //** */
    //====================================================================================================
    onLoad() {
        this.contain.getChildByName('anniuA').on('click', this.OnGetBtnClicked, this);
        this.GetMsg();
    },

    onDestroy() {
        ff.BuryingPoint(3401020001);
    },

    //====================================================================================================
    //** */
    //====================================================================================================
    OnGetBtnClicked(event) {
        if (!this._itemData) { return; }
        /* 首页-首冲特惠-充值 */
        ff.BuryingPoint(3401010002, {
            recharge_rmb: this._itemData.price,
            awards_id: this._itemData.bizId
        });

        var isCanBuyFlag = ff.AccountManager.onIsCanBuy(this._itemData, '您已经购买过首充礼包，请不要重复购买');
        if (!isCanBuyFlag) return;

        ff.AccountManager.openPay(this._itemData, () => {
            this.node.emit('close');
        });
    },

    //====================================================================================================
    //** */
    //====================================================================================================
    GetMsg() {
        // ff.AccountManager.shopConfig.refreshFirstChargeData((data) => {
        //     this.DoMsg(data);
        // })
    },

    //====================================================================================================
    //** */
    //====================================================================================================
    DoMsg(data) {
        if (data.length > 0) {
            this._itemData = data[0];
            this._id = data[0].bizId;
            var awardsList = data[0].awardsList;
            for (var i = 0; i < awardsList.length; i++) {
                var item = this.contain.getChildByName('item_' + (i + 1));
                if (!item) { continue; }

                var sptComp = item.getChildByName('spt_item').getComponent(cc.Sprite);
                sptComp && sptComp.loadImage(awardsList[i].awardsImage);

                var lblDesc = item.getChildByName('lbl_desc');
                if (awardsList[i].awardsType === 105) {
                    lblDesc.active = true;
                    continue;
                }

                var lblComp = item.getChildByName('lbl_count').getComponent(cc.Label);
                lblComp && (lblComp.string = ":" + awardsList[i].awardsNum);
            }
        }
    }

    //====================================================================================================
    //** */
    //====================================================================================================

});
