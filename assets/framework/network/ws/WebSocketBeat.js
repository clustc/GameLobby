const BEAT_INTERVAL = 5;

cc.Class({

    extends: cc.Component,

    properties: {
        
    },

    onLoad() {
        this.buffer = null;
        this.beatTimer = 0;
        this.beatDelay = 0;
        this.stopped = true;
        this.timestamp = new Date().getTime() / 1000;
        this.wslink = this.node.getComponent('WebSocketLink');
        this.wslink.on('HeartBeatMsg', this.onMessage, this);
    },

    stopBeat() {
        this.stopped = true;
    },

    startBeat() {
        this.beatTimer = 0;
        this.beatDelay = 0;
        this.stopped = false;
        this.timestamp = new Date().getTime() / 1000;
        this.buffer = this.wslink.getMsgBuffer('HeartBeatMsg');
        this.sendMessage();
    },

    onMessage(event) {
        /**重置delay，说明服务端返回了 */
        this.beatDelay = 0;
        this.timestamp = event.detail.timestamp;
    },
    
    sendMessage() {
        this.beatTimer = 0;
        this.wslink.sendMsgBuffer(this.buffer);
    },

    update(dt) {
        if(this.stopped) return;
        this.timestamp += dt;
        this.beatDelay += dt;
        this.beatTimer += dt;
        if(this.beatTimer > BEAT_INTERVAL) this.sendMessage();
        /**没有重置，服务端都没有返回，说明断开 */
        if(this.beatDelay > BEAT_INTERVAL * 2) this.wslink.onTimeout();
    },
});
