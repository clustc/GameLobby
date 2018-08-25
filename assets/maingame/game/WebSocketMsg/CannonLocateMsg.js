cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(12);
    },

    getParamConfig() {
        return {
            targets: {
                fishId: 'int',
                fishOrder: 'int',
            }
        };
    },

    getBufferConfig() {
        return {
            place: 'byte',
            targets: {
                fishId: 'int',
                fishOrder: 'int',
            }
        };
    },
});
