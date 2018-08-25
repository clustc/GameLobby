cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(15);
    },

    getParamConfig() {
        return {
        };
    },

    getBufferConfig() {
        return {
            place: 'byte',
        };
    },
});
