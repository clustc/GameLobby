cc.Class({
    properties: {
        data: {
            get() {
                return this._data;
            }
        },
    },

    loadSpriteFrame(data) {
        data.spriteFrame = ff.ConstAssets.skinImages['vip' + data.cannonType];
        data.nameSpriteFrame = ff.ConstAssets.skinImages['vip_name_' + data.cannonType];
    },

    refreshData(cbk) {
        cc.Linker('SkinCannon').request(data => {
            cc.log('SkinCannon   '+JSON.stringify(data));
            this._data = data;
            for(var i in data) this.loadSpriteFrame(data[i]);
            cbk && cbk();
        });
    },

    getConfigByVipLevel(vipLevel) {
        for (var i in this._data) {
            if (this._data[i].vipLevel == vipLevel) return this._data[i];
        }
    },

});
