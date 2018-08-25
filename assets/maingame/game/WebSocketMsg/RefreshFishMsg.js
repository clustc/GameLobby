cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(3);
    },

    getParamConfig() {
        return {};
    },

    getBufferConfig() {
        return {
            timestamp: 'int',
            fishes: {
                type: 'byte',
                id: 'int',
                name: 'string',
                time: 'int',
                path: 'short',
                dead: {
                    index: 'int'
                }
            },
        };
    },
});
