cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(14);
    },

    getParamConfig() {
        return {};
    },

    getBufferConfig() {
        return {
            code: 'byte'
        };
    },
});
