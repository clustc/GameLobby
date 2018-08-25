cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(9);
    },

    getParamConfig() {
        return {};
    },

    getBufferConfig() {
        return {
            propertys: {
                propertyType: 'int',
                changeValue: 'int',
                value: 'int'
            },
            propInfos: {
                propId: 'int',
                propNum: 'int',
            }
        };
    },
});
