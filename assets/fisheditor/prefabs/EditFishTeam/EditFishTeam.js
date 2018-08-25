cc.Class({
    extends: require('EditDataView'),

    properties: {
        fishCount: require('EditInputCount'),
        fishDelay: require('EditInputValue'),
        fishRange: require('EditInputValue'),
    },

    onLoad() {
        this.fishCount.init([2, 3, 4, 5, 6]);
        this.fishDelay.init(cc.p(10, 10000));
        this.fishRange.init(cc.p(10, 1000));
        this.bindView('count', this.fishCount);
        this.fishCount.node.on('input-change', this.onInputChange, this);
        this.fishDelay.node.on('input-change', this.onInputChange, this);
        this.fishRange.node.on('input-change', this.onInputChange, this);
    },

    init(type) {
        if (type === 'queue') {
            this.fishRange.node.parent.active = false;
            this.bindView('delay', this.fishDelay);
        } else {
            this.fishDelay.node.parent.active = false;
            this.bindView('range', this.fishRange);
        }
    },

    onInputChange() {
        this.node.emit('input-change');
    }
});
