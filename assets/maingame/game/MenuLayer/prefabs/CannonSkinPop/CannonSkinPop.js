cc.Class({
    extends: cc.Component,

    properties: {
        itemNode: cc.Node,
    },

    onLoad() {
        this.wearItem = null;
        this.container = this.itemNode.parent;
       

        ff.WSLinkManager.on('CannonSkinMsg', this.onCannonSkinMsg, this);
    },

    onDestroy() {
        ff.WSLinkManager.off('CannonSkinMsg', this.onCannonSkinMsg, this);
    },

    init(battery) {
        var skinId = ff.AccountManager.cannonConfig.skinId;
        cc.log('init skin   '+skinId);
        /**基础炮 */
        var item = this.itemNode.getComponent('CannonSkinItem');
        item.init({ isUnlock: true, isWeard: skinId === 0, level: battery.level, skinId: 0 });

        /**贵族炮 */
        // var node = cc.instantiate(this.itemNode);
        // var item = node.getComponent('CannonSkinItem');
        // node.parent = this.container;
        // item.init({ isUnlock: battery.data.isNoble, isWeard: skinId === 1001, level: 0, skinId: 1001 });

       
        this.betAmount = ff.AccountManager.betAmount;
        /**vip炮 */
        var vipData = ff.AccountManager.cannonConfig.data;
        for(var i = 0; i < vipData.length; i++) {
            cc.log('need lock   '+vipData[i].betAmount + 'idnex  '+i +'nanme    '+vipData[i].cannonName);
            var viplv = vipData[i].betAmount;
            
            var node = cc.instantiate(this.itemNode);
            var item = node.getComponent('CannonSkinItem');
            node.parent = this.container;
            item.init({ isUnlock: viplv <= this.betAmount, isWeard: skinId === (i + 1), level: viplv, skinId: (i+1) });
        }

        /**更新状态 */
        for(var i in this.container.children) {
            var item = this.container.children[i].getComponent('CannonSkinItem');
            item.node.on('get-item', this.onGetItem, this);
            item.node.on('wear-item', this.onWearItem, this);
            if(item.data.skinId === skinId) {
                this.wearItem = item;
                this.wearItem.onWeared();
            }
        }
    },

    onGetItem(event) {
        this.node.emit('close');
        var skinId = event.detail.data.skinId;
        for(var i in this.container.children){
            var item = this.container.children[i].getComponent('CannonSkinItem');
            if(item.data.skinId === skinId){
                if (item.data.level > 10000){
                    var ret = parseInt(item.data.level/10000)+'万';
                    cc.Toast('需要' + ret + '流水才能解锁').show();
                }else{
                    cc.Toast('需要' + item.data.level + '流水才能解锁').show();
                }
            }
        }
        // if(skinId < 1000) cc.Popup('VipPrivilegePop').show();
        // else cc.Popup('VipGiftPop').show();
    },

    onWearItem(event) {
        ff.WSLinkManager.send('CannonSkinMsg', { skinId: event.detail.data.skinId });
    },

    onCannonSkinMsg(event) {
        if(ff.CannonManager.batterys[event.detail.place] === ff.ControlManager.battery) {
            var skinId = event.detail.skinId;
            ff.AccountManager.cannonConfig.skinId = skinId;
            for(var i in this.container.children) {
                var item = this.container.children[i].getComponent('CannonSkinItem');
                if(item.data.skinId === skinId) {
                    this.wearItem = item;
                    this.wearItem.onUnwear();
                    this.wearItem.onWeared();
                }else{
                    if (item.data.level > this.betAmount){ //所需流水大于总的流水
                        item.canGetItem();
                    }else{
                        item.onUnwear();
                    }
                }
            }
        }
    }
});
