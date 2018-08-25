cc.Class({

    extends: require('BaseBufferMsg'),

    properties: {

    },

    ctor() {
        this.serviceId = 1;
        this.msgId = 1;
        this.seq = 1;
    },

    init(msgId) {
        this.msgId = msgId;
    },

    setHeader() {
        this.setsDataViewIndex = 0;
        this.setShort(this.serviceId);
        this.setShort(this.msgId);
        this.setInt(this.seq);
    },

    getHeader(dataView) {
        this.getsDataViewIndex = 0;
        this.getsDataView = dataView;
        this.serviceId = this.getShort();
        this.msgId = this.getShort();
        this.seq = this.getInt();
    },

    /**
     * {
     *  id: 'int',
     *  name: 'string',
     *  props: { id: 'int', name: 'string' }
     * }
     */
    getParamConfig() {
        return {};
    },

    getBufferConfig() {
        return {};
    },

    parseParam(data) {
        this.setHeader();
        var config = this.getParamConfig();
        cc.log('ws send config ',config);
        for(var i in config) this.setValue(config[i], data[i]);
        cc.log('WS SEND => ', data)
        return this;
    },

    parseBuffer(dataView) {
        this.getHeader(dataView);
        var ret = {};
        var config = this.getBufferConfig();
        for(var i in config) {
            ret[i] = this.getValue(config[i]);
        }
        ret = this.parseReceive(ret);
        cc.log('WS RECEIVE => ', ret);
        return ret;
    },

    parseReceive(data) {
        return data;
    },
});
