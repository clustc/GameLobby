cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(11);
    },

    getParamConfig() {
        return {};
    },

    getBufferConfig() {
        return {
            props: {
                propId: 'int',
                propNum: 'int',
            }
        };
    },
});
