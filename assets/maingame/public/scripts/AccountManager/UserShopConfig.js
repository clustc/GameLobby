cc.Class({
    extends: cc.EventTarget,

    properties: {
        shopData: {
            get() {
                return this._shopData;
            }
        },
        vipDrawConfig: {
            get() {
                return this._vipDrawConfig;
            }
        },
        freeDrawData: {
            get() {
                return this._freeDrawData;
            }
        },
        synthesisData: {
            get() {
                return this._synthesisData;
            }
        },
        exchangeData: {
            get() {
                return this._exchangeData;
            }
        },
        firstChargeData: {
            get() {
                return this._firstChargeData;
            }
        },
        vipGiftData: {
            get() {
                return this._vipGiftData;
            }
        },

        EVENT_REFRESH_FREEDRAW: 'EVENT_REFRESH_FREEDRAW',
    },

    ctor() {
        this._isImage = 1;
        this._imageAmount = 8;
        this._shopData = null;
        this._vipDrawConfig = null;
        this._freeDrawData = null;
        this._synthesisData = null;
        this._exchangeData = null;
        this._firstChargeData = null;
        this._vipGiftData = null;
        this.preLoadNode = new cc.Node('Sprite');
    },

    refreshData(cbk) {
        // this.refreshShopData();
        // this.refreshVipDrawData();
        // this.refreshFreeDrawData();
        // this.refreshSynthesisData();
        // this.refreshExchangeData();
        // this.refreshFirstChargeData();
        // this.refreshVipGiftDataData();
        cbk && cbk();
    },

    refreshShopData(cbk, isLoading) {
        isLoading = isLoading == 'isLoading';
        cc.Linker('GetShopConfigList').showLoading(isLoading).request((data) => {
            this._shopData = data;
            cbk && cbk(data);
            if (!this._isImage || data.length == 0) return;
            this.preLoad(data.month, 'icon');
            this.preLoad(data.gold, 'icon');
            this.preLoad(data.daimand, 'icon');
        });
    },

    refreshVipDrawData(cbk, isLoading) {
        isLoading = isLoading == 'isLoading';
        // cc.Linker('GetVipDrawConfig').showLoading(isLoading).request((data) => {
        //     this._vipDrawConfig = data;
        //     cbk && cbk(data);
        // })
    },

    refreshFreeDrawData(cbk, isRefresh) {
        cc.Linker('GetFreeDrawLists').request((data) => {
            this._freeDrawData = data;
            cbk && cbk(data);
            if (!isRefresh) return;
            this.emit(this.EVENT_REFRESH_FREEDRAW);
        });
    },

    refreshSynthesisData(cbk, isLoading) {
        isLoading = isLoading == 'isLoading';
        cc.Linker('GetSynthesisList', { page: 1, pageSize: 100 }).showLoading(isLoading).request((data) => {
            this._synthesisData = data;
            cbk && cbk(data);
            if (!this._isImage || data.length == 0) return;
            this.preLoad(data, 'awardsImage');
        })
    },

    refreshExchangeData(cbk, isLoading) {
        isLoading = isLoading == 'isLoading';
        cc.Linker('GetExchangeList', { page: 1, pageSize: 100 }).showLoading(isLoading).request((data) => {
            this._exchangeData = data;
            cbk && cbk(data);
            if (!this._isImage || data.length == 0) return;
            this.preLoad(data.list, 'icon');
        })
    },

    refreshFirstChargeData(cbk) {
        cc.Linker('GetFirstCharge').request((data) => {
            this._firstChargeData = data;
            cbk && cbk(data);
            if (!this._isImage || data.length == 0) return;
            this.preLoad(data[0].awardsList, 'awardsImage');
        });
    },

    refreshVipGiftDataData(cbk, isLoading) {
        isLoading = isLoading == 'isLoading';
        // cc.Linker('GetVipAward').showLoading(isLoading).request((data) => {
        //     this._vipGiftData = data;
        //     cbk && cbk(data);
        //     if (!this._isImage || data.length == 0) return;
        //     this.preLoad(data[0].awardsList, 'awardsImage');
        // });
    },

    preLoad(list, addr) {
        var sp = this.preLoadNode.addComponent(cc.Sprite);
        var url;
        for (var i = 0; i < list.length; i++) {
            url = list[i][addr];
            url && sp.loadImage(url);
        }
        if (this._isImage >= this._imageAmount) this._isImage = false;
        else this._isImage++;
    },
});
