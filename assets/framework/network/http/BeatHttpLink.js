cc.Class({
    extends: cc.Component,

    properties: {
 
    },

    onLoad() {
        this.schedule(this.httpHeartBeat, 5);
    },

    onDestroy() {
        this.unschedule(this.httpHeartBeat);
    },

    httpHeartBeat() {
        cc.BaseLinker('HttpHeartBeat').request(data => {
            cc.systemEvent.emit('ON_BEAT_HTTP_RECEIVED', data);
        });
    },
});