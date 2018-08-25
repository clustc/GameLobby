cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(10);
    },

    getParamConfig() {
        return {
            propId: 'int'
        };
    },

    getBufferConfig() {
        return {
            place: 'byte',
            propId: 'int',
            propTime: 'int'
        };
    },
});
