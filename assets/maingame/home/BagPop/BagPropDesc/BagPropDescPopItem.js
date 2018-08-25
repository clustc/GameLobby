cc.Class({
    extends: cc.Component,

    properties: {
        itemTitle: cc.Label,
        itemIcon: cc.Sprite,
        // selected: [cc.SpriteFrame],
        price: cc.Label,
        desc: cc.Label,
    },

    onLoad() {
        this.propItemId = -1;
        this.node.on('touchstart', (event) => event.stopPropagation(), this);
    },

    onDestroy() {
        this.node.off('touchstart', (event) => event.stopPropagation(), this);
    },

    initItem(data, positionY, cbk, obj) {
        cc.log('prop des  '+JSON.stringify(data));
        this.propScript = obj;
        if (data.effectType != 3 && data.effectType != 4 && data.effectType != 5 && data.effectType != 6) {
            this.price.node.parent.active = false;
        }
        else {
            this.price.node.parent.active = true;
        }
        this.itemTitle.string = data.name;
        this.itemIcon.spriteFrame = ff.AccountManager.propsConfig.getPropById(data.propId).spriteFrame;
        this.price.string = '价格：' + data.buyCoin + '金币/次';
        this.desc.string = data.desc;
        this.positionY = positionY;
        cbk && cbk();
    },

    onClosePop(event) {
        this.node.stopAllActions();
        this.node.parent.active = false;
        this.node.y = this.positionY;
        this.propScript.isShowPropDesc = false;
    }
});
