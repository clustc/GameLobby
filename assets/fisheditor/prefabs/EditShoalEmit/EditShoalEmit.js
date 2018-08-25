cc.Class({
    extends: require('EditDataView'),

    properties: {
        emitVelocity: require('EditInputValue'),
        emitInterval: require('EditInputValue'),
        emitDuration: require('EditInputValue'),
    },

    onLoad() {
        this.bindView('velocity', this.emitVelocity);
        this.bindView('interval', this.emitInterval);
        // this.bindView('duration', this.emitDuration);
        this.emitVelocity.init(cc.p(10, 10000));
        this.emitInterval.init(cc.p(10, 100000));
        // this.emitDuration.init(cc.p(900, 900000));
    },

    start() {

    },

});
