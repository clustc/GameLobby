cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(6);
    },

    getParamConfig() {
        return {
            fishId: 'int',
            fishOrder: 'int',
            level: 'int'
        };
    },

    getBufferConfig() {
        return {
            place: 'byte',
            fishId: 'int',
            fishOrder: 'int',
            level: 'int',
            gainCoins: 'int',
            isCaught: 'byte',
            coins: 'int',
            // jewels: 'int',
            props: {
                propId: 'int',
            }
        };
    },
});
