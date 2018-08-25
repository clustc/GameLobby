cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(4);
    },

    getParamConfig() {
        return { };
    },

    getBufferConfig() {
        return {
            roomPlayers: {
                id: 'int',
                place: 'byte',
                level: 'int',
                coins: 'int',
                // jewels: 'int',
                name: 'string',
                photo: 'string',
                // vipLevel: 'byte',
                vipSkin: 'byte'
            },
            playerExtras: {
                isNoble: 'byte',
                skinId: 'short'
            }
        };
    },
});
