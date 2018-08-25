/**服务端对应类型 */
const PROP_TYPES = { jewel: 1, coin: 2, locate: 3, freeze: 4, crazy: 5, clone: 6, cardHF: 7, activity: 8, activity: 9, aiqiyi: 11, iphone: 12, cardJD: 13 };
/*描述*/
const PROP_DESC = {
    [1]: '钻石',
    [2]: '金币',
    [3]: '话费',
    [11]: '锁定',
    [12]: '冰冻',
    [13]: '1级狂暴',
    [14]: '2级狂暴',
    [15]: '1级影分身',
    [16]: '2级影分身',
    [17]: '日活跃值',
    [18]: '周活跃值',
}
/**玩家属性类型 对应的描述id*/
const PROP_ATT_ARR = ["coin", "level", "pao_level", "day_activity", "week_activity"]
const PROP_ATTRIBUTES = {
    coin: 2, //金币
    diamond: 1,//钻石
    // level: 3,//等级
    // pao_level: 4,//炮台等级
    day_activity: 17,//日活跃度
    week_activity: 18,//周活跃度
}


cc.Class({
    properties: {
        data: {
            get() { return this._data; },
            set(d) { this.setData(d); }
        }
    },

    ctor() {
        this._data = null;
    },

    setData(data) {
        if (!this._data) this._data = data;
        for (var i in data) {
            var prop = data[i];
            for (var j in PROP_TYPES) {
                if (PROP_TYPES[j] == prop.effectType) {
                    prop.propName = j;
                    prop.spriteFrame = ff.ConstAssets.propImages[j];
                }
            }
            /**记录数量变化 */
            prop.propNumAdd = 0;
            if (this._data[i]) prop.propNumAdd = prop.propNum - this._data[i].propNum;
        }
        this._data = data;
        this.wrapPropData();
        ff.AccountManager.emit('EVENT_VIP_LEVEL_CHANGE', this.wrapPropData, this);
    },

    refreshData(cbk) {
        cc.Linker('TotalBetAmount').request(data =>{
            this.betAmount = data.betAmount;
            cc.Linker('GetPropsList').request(data => {
                cc.log('GetPropsList    '+JSON.stringify(data));
                this.data = data.prop;
                cbk && cbk();
            });
        });
        


    },

    wrapPropData() {
        var names = ['locate', 'freeze', 'crazy', 'clone'];
        for (var i in names){
            var prop = this.getPropByName(names[i]);
            // var effectValues = prop.effectValue.split('#');// '14,2#16,3'
            // var vipConfig = effectValues[propLevel - 1].split(',');
            prop.propEnabled = false;
        }
        for (var i in names){
            var prop = this.getPropByName(names[i]);
            cc.log('wrapPropData    '+JSON.stringify(prop));
            prop.propLevel = 2;
            prop.propEnabled = true;
        }
        return;
        var vipdata = ff.AccountManager.vipConfig.data;
        var vcfg = ff.AccountManager.vipConfig.getConfigByVipLevel(ff.AccountManager.vipLevel);
        for (var i in names) {
            var prop = this.getPropByName(names[i]);
            if (i > 1) {
                var index = i - 2;
                /**解锁所需等级 */
                for (var j in vipdata) {
                    var array = vipdata[j].openSkillArray;
                    if (array) {
                        if (array.length === 1 && array[index] === 1) {
                            prop.openLevel = vipdata[j].vipLevel;
                            break;
                        }
                        if (array.length === 2 && array[index] === 1) {
                            prop.openLevel = vipdata[j].vipLevel;
                            break;
                        }
                    }
                }
                var effectValues = prop.effectValue.split('#');// '14,2#16,3'
                prop.propEnabled = false;
                if (!vcfg) continue;
                var openSkillArray = vcfg.openSkillArray; // [1,2]
                if (!openSkillArray) continue;
                var propLevel = openSkillArray[i - 2];
                if (propLevel === undefined) continue;
                var vipConfig = effectValues[propLevel - 1].split(',');
                prop.propLevel = parseInt(vipConfig[1]);
                prop.propEnabled = true;
            }
        }
    },

    /**服务端没配置时返回一个默认值 */
    getDefaultProp(name) {
        return {
            propId: PROP_TYPES[name],
            propName: name,
            propNum: 0,
            spriteFrame: ff.ConstAssets.propImages[name]
        }
    },

    getPropById(id) {
        for (var i in this._data) {
            if (this._data[i].id == id) {
                return this._data[i];
            }
        }
        var name = null;
        for (var j in PROP_TYPES) if (PROP_TYPES[j] == id) return name = j;
        return this.getDefaultProp(name);
    },

    getPropDescById(id) {
        return PROP_DESC[id];
    },

    getPropDescByAttType(type) {
        var att_type = PROP_ATT_ARR[type - 1];
        return PROP_ATTRIBUTES[att_type];
    },

    getPropByName(name) {
        for (var i in this._data) {
            if (this._data[i].propName == name) return this._data[i];
        }
        return this.getDefaultProp(name);
    },

    getSpriteByName(name) {
        return ff.ConstAssets.propImages[name];
    },

    onPropsChange(props) {
        for (var i in props) {
            var prop = this.getPropById(props[i].propId);
            prop.propNumAdd = props[i].propNum - prop.propNum;
            prop.propNum = props[i].propNum;
        }
    }
})