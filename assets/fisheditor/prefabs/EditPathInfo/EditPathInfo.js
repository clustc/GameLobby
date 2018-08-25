cc.Class({
    extends: require('EditDataView'),

    properties: {
        pathCount: require('EditInputCount'),
        pathSpeed: require('EditInputValue'),
        stayRate: require('EditInputValue'),
        stayTime: require('EditInputValue'),
    },

    onLoad() {
        this.pathCount.init([3, 5, 7, 9]);
        this.pathSpeed.init(cc.p(10, 1000));
        this.stayRate.init(cc.p(0, 100));
        this.stayTime.init(cc.p(0, 9999999));
        this.bindView('count', this.pathCount);
        this.bindView('speed', this.pathSpeed);
        this.bindView('stayRate', this.stayRate);
        this.bindView('stayTime', this.stayTime);
        this.pathCount.node.on('input-change', this.onInputChange, this);
        this.pathSpeed.node.on('input-change', this.onInputChange, this);
        this.stayRate.node.on('input-change', this.onInputChange, this);
        this.stayTime.node.on('input-change', this.onInputChange, this);
    },

    onInputChange() {
        this.node.emit('input-change');
    }
});
