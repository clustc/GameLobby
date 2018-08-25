cc.Class({
    extends: require('PoolLayer'),

    properties: {
        labelItem: cc.Prefab,
    },

    onLoad() {
        this.prepareObject(10);
    },

    produce() {
        var object = this._super();
        object.node.setSiblingIndex(this.node.childrenCount);
        return object;
    },  
    
    createObject() {
        var node = cc.instantiate(this.labelItem);
        node.x = node.y = 100000;
        node.parent = this.node;
        return node.getComponent('AwardLabelItem');
    },

    resetObject(object) {
        object.node.x = object.node.y = 100000;
    },

    onCaughtFish(data) {
        this.jumpLabel(data.position.clone().sub(cc.p(0, 20)), data.gainCoins);
    },

    jumpLabel(startPos, count) {
        var item = this.produce();
        item.node.position = startPos;
        item.label.string = ':' + count;
        item.animateJump(() => this.reclaim(item));
    },

    floatLabel(startPos, count) {
        var item = this.produce();
        item.node.position = startPos;
        item.label.string = ':' + count;
        item.animateFloat(() => this.reclaim(item));
    },

    floatGainCoins(startPos, count) {
        this.scheduleOnce(() => this.floatLabel(startPos, count), 1.6);
    }
});
