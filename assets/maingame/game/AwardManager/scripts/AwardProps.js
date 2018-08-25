cc.Class({
    extends: require('PoolLayer'),

    properties: {
        propItem: cc.Prefab,
        jewelAnim: cc.Prefab,
    },

    onLoad() {
        this.prepareObject(10);
        this.prepareObject(10, 'jewel');
        cc.systemEvent.on('EvevtFlyItemToMyPos', this.FlyItemToMyPos, this);
    },

    onDestroy() {
        cc.systemEvent.off('EvevtFlyItemToMyPos', this.FlyItemToMyPos, this);
    },

    createObject(type) {
        var object = null;
        if (type === 'jewel') {
            object = cc.instantiate(this.jewelAnim).getComponent('AwardPropItem');
        } else {
            object = cc.instantiate(this.propItem).getComponent('AwardPropItem');
        }
        object.node.parent = this.node;
        object.node.x = object.node.y = 10000;
        return object;
    },

    resetObject(object, type) {
        object.node.zIndex = 0;
        object.node.x = object.node.y = 10000;
    },

    flyProp(propId, propNum, startPos, finishPos, duration, delay) {
        var prop = ff.AccountManager.propsConfig.getPropById(propId);
        var item = this.produce();
        item.setIcon(prop.spriteFrame).setCount(propNum);
        item.animateFly(startPos, finishPos, duration, delay, () => this.reclaim(item));
        return item;
    },

    onDropProps(data) {
        var props = data.props;
        var startPos = data.position.clone();
        var finishPos = data.battery.getCannonPosition();
        if(props.length == 1) startPos.addSelf(cc.p(Math.rand(-30, 30), Math.rand(-30, 30)));
        startPos.x -= Math.floor(props.length / 2) * 120;
        startPos.y += 80;
        var count = 0;
        var flyProp = () => {
            var prop = ff.AccountManager.propsConfig.getPropById(props[count]);
            var type = null;
            prop.propName === 'jewel' && (type = prop.propName);
            var item = this.produce(type);
            !type && item.setIcon(prop.spriteFrame);
            item.animateFly(startPos, finishPos, 0.8, 1, () => this.reclaim(item, type));
            if (++count < props.length) setTimeout(flyProp, 100);
            startPos.x += 120;
        }
        flyProp();
    },

    FlyItemToMyPos(event) {
        var param = event.detail;
        var finishPos = ff.ControlManager.battery.getCannonPosition();
        var startPos = cc.p(0, this.node.height / 2 - 220);
        this.flyProp(param.item_id, param.item_num, startPos, finishPos, 0.8, 1);
    },
});
