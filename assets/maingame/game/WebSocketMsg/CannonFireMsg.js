cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(5);
    },

    getParamConfig() {
        return {
            rotation: 'float'
        };
    },

    getBufferConfig() {
        return {
            place: 'byte',
            rotation: 'float'
        };
    },
});
