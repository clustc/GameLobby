cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(8);
    },

    getParamConfig() {
        return {
            level: 'int'
        };
    },

    getBufferConfig() {
        return {
            place: 'byte',
            level: 'int'
        };
    },
});
