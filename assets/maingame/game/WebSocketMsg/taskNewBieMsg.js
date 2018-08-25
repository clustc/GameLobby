cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(17);
    },

    getBufferConfig() {
        return {
            taskId: 'int',
            taskStatus: 'byte',
            propress: 'int',
        };
    },
});
