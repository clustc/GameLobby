cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(2);
    },

    getParamConfig() {
        return {};
    },

    getBufferConfig() {
        return {
            code: 'short'
        };
    },
});
