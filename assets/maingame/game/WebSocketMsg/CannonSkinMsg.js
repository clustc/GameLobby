cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(16);
    },

    getParamConfig() {
        return {
            skinId: 'short'
        };
    },

    getBufferConfig() {
        return {
            place: 'byte',
            skinId: 'short',
        };
    },
});
