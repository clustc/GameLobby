const SEND_PERIOD = 300;

cc.Class({
    extends: cc.Component,

    properties: {
        timestamp: {
            get() { return this.wsbeat.timestamp; }
        },
        connected: {
            get() { return !this.isDestroy && this.ws && this.ws.readyState === WebSocket.OPEN; }
        },
    },

    onLoad() {
        this.MSG_NAMES = {};
        this.MSG_ARRAY = {};
        this.sendsQueue = [];
        this.sendPeriod = 0;
        this.isDestroy = false;
        this.ws = null;
        this.wsurl = '';
    },

    start() {
        this.wsbeat = this.node.addComponent('WebSocketBeat');
        this.wsutil = this.node.addComponent('WebSocketUtil');
    },

    init(url) {
        this.wsurl = url;
    },

    reset() {
        this.clearWS();
        this.sendsQueue = [];
        this.wsbeat.stopBeat();
    },

    onGameHide() {

    },

    onGameShow() {
        this.onTimeout();
    },

    onTimeout() {
        cc.log('onTimeout   '+this.connected);
        if (this.connected) return;
        this.reset();
        this.wsutil.reconnect();
    },

    onDestroy() {
        this.reset();
        this.isDestroy = true;
    },

    onBreakoff(error) {
        this.isDestroy = true;
        this.wsbeat.stopBeat();
        this.wsutil.onBreakoff(error);
    },

    createWS(onopen, onmessage, onerror, onclose) {
        var ws = null;
        if(cc.sys.isBrowser) ws = new WebSocket(this.wsurl);
        else ws = new WebSocket(this.wsurl, null, cc.url.raw('resources/cacert.pem'));
        ws.onopen = onopen;
        ws.onmessage = onmessage;
        ws.onerror = onerror;
        ws.onclose = onclose;
        ws.binaryType = 'arraybuffer';
        return ws;
    },

    clearWS() {
        if(!this.ws) return;
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onerror = null;
        this.ws.onclose = null;
        this.ws.close();
        this.ws = null;
    },

    bindWS(ws) {
        this.clearWS();
        ws.onopen = this.onopen.bind(this);
        ws.onmessage = this.onmessage.bind(this);
        ws.onerror = this.onerror.bind(this);
        ws.onclose = this.onclose.bind(this);
        ws.binaryType = 'arraybuffer';
        this.ws = ws;
        this.wsbeat.startBeat();
    },

    getMsg(name) {
        if(typeof name !== 'string') return cc.error('NO WS MSG => ', name);
        var message = this.MSG_ARRAY[name];
        if(!message) {
            var clazz = require(name);
            if(!clazz) return cc.error('NO WS MSG => ' + name);
            message = new clazz();
            message.name = name;
            this.MSG_ARRAY[name] = message;
            this.MSG_NAMES[message.msgId] = name;
        }
        return message;
    },

    getMsgById(id) {
        var name = this.MSG_NAMES[id];
        return name ? this.getMsg(name) : null;
    },

    getMsgBuffer(name, param) {
        return this.getMsg(name).parseParam(param).buffer;
    },

    sendMsgBuffer(buffer) {
        this.connected && this.ws.send(buffer);
    },

    parseReceive(event) {
        var dataview = new DataView(event.data);
        var message = this.getMsgById(dataview.getInt16(2));
        return message ? message.parseBuffer(dataview) : null;
    },

    /********************ws msg bind*******************/
    on(name, cbk, target) {
        var message = this.getMsg(name);
        message && message.on(name, cbk, target);
    },

    off(name, cbk, target) {
        var message = this.getMsg(name);
        message && message.off(name, cbk, target);
    },

    send(name, param) {
        cc.log('msg name  '+name);
        cc.log('msg parames  ',param);
        this.sendsQueue.push(this.getMsg(name).parseParam(param).buffer);
        this.sendPeriod = 0;
    },

    update(dt) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        while (this.sendsQueue.length > 0) this.ws.send(this.sendsQueue.shift());        
        this.sendPeriod += dt;
        if(this.sendPeriod > SEND_PERIOD) {
            this.ws.close();
            this.onBreakoff('您已经5分钟没有秀操作，休息一下吧！');
        }
    },

    /********************ws callback*******************/
    onopen() {
        console.log('WS OPEN');
    },

    onmessage(event) {
        var dataview = new DataView(event.data);
        var message = this.getMsgById(dataview.getInt16(2));
        message && message.emit(message.name, message.parseBuffer(dataview));
    },

    onerror(event) {
        console.log('WS ERROR => ', event);
    },

    onclose(event) {
        console.log('WS CLOSE => ', event);
    },

});
