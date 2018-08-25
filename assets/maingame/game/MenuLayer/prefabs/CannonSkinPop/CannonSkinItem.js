cc.Class({
    extends: cc.Component,

    properties: {
        container: cc.Node,
        skinIcon: cc.Sprite,
        skinName: cc.Sprite,
        btnGet: cc.Node,
        btnWear: cc.Node,
        txtWeared: cc.Node,
        itemLock: cc.Node,
    },

    onLoad() {
        this.btnGet.on('click', this.onGetItem, this);
        this.btnWear.on('click', this.onWearItem, this);
    },

    init(data) {
        /**
         * isUnlock,
         * isWeard,
         * level,
         * skinId,
         */
        cc.log('skin pop data  '+JSON.stringify(data));
        this.skinIcon.spriteFrame = ff.ConstAssets.getCannonSkin(data.skinId, data.level);
        this.skinName.spriteFrame = ff.ConstAssets.getCannonName(data.skinId);
        this.itemLock.active = !data.isUnlock;
        this.btnGet.active = !data.isUnlock;
        this.btnWear.active = data.isUnlock;
        !data.isUnlock && this.container.setCascadeColor(cc.color(150, 150, 150));
        this.data = data;
    },
    
    onGetItem() {
        this.node.emit('get-item', this);
    },

    onWearItem() {
        this.node.emit('wear-item', this);
    },

    onWeared() {
        this.btnWear.active = false;
        this.txtWeared.active = true;
    },
    
    onUnwear() {
        this.btnWear.active = true;
        this.txtWeared.active = false;
    },
    canGetItem:function(){
        this.btnGet.active = true;
        this.btnWear.active = false;
    },
    
});
