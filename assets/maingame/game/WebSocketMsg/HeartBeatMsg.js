cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(7);
    },

    getParamConfig() {
        return {};
    },

    getBufferConfig() {
        return {
            timestamp: 'int'
        };
    },
});
