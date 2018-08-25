const Global = require('CCGlobal');

cc.Class({

    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.isBreakOff = false;
        this.wslink = this.node.getComponent('WebSocketLink');
    },

    start() {
        this.wslink.init(Global.websocketUrl);
        this.wslink.bindWS(this.wslink.createWS());
        this.wslink.on('ErrorCodeMsg', this.onErrorCodeMsg, this);
        this.wslink.send('EnterRoomMsg', this.getEnterRoomParam());
    },

    onErrorCodeMsg(event) {
        if(event.detail.code == 48) {
            if(this.isBreakOff) return;
            this.wslink.reset();
            this.isBreakOff = true;
            cc.Toast('系统检测到您存在违规操作，当前无法继续游戏！').showDialog();
            ff.AccountManager.emit('EVENT_USER_LOGOUT');
        }
    },

    onBreakoff(error) {
        if(this.isBreakOff) return;
        error = error || '连接出错，请重进！';
        this.wslink.reset();
        this.isBreakOff = true;
        cc.Toast(error).showDialog(() => ff.GameManager.loadScene('HomeScene'));
    },

    getEnterRoomParam() {
        return {
            accessToken: Global.accessToken,
            enterRoomId: ff.AccountManager.roomConfig.enterRoomId,
            cannonLevel: ff.AccountManager.roomConfig.getRoomCannonLevel(),
            selectRoomId: ff.AccountManager.roomConfig.selectRoomId,
        }
    },

    getReconnectParam() {
        return {
            accessToken: Global.accessToken
        }
    },

    /**重连后获得结果 */
    onReconnectReceive(ws, event) {
        var data = this.wslink.parseReceive(event);
        console.log('===============reconnect receive=>', JSON.stringify(data))
        if(data.code == 45) return setTimeout(() => this.reEnterRoom(ws), 1000);
        if(data.code != 0) return this.onBreakoff(cc.Linker.ErrorCode[data.code]);
        this.onReconnectSuccess(ws, data);
    },

    /**重连成功后 */
    onReconnectSuccess(ws, data) {
        console.log('===============reconnect success=>', JSON.stringify(data));
        this.wslink.bindWS(ws);
        var event = { detail: data };
        ff.FishManager.onReconnectMsg(event);
        ff.CannonManager.onReconnectMsg(event);
        setTimeout(() => cc.Toast('重连成功！').show(), 2000);
    },

    /**重新发送进入房间消息 */
    reEnterRoom(ws) {
        ws && ws.close();
        this.onBreakoff('与服务器断开连接，请重新进入！');
    },

    reconnect() {
        var ws = null;
        var failed = false;
        var rebuffer = this.wslink.getMsgBuffer('ReconnectMsg', this.getReconnectParam());
        var onfailure = () => {
            console.log('WS RE FAILED');
            if(failed || this.wslink.connected) return;
            failed = true;
            this.reEnterRoom(ws);
        };
        setTimeout(() => {
            console.log('WS RECONNECT');
            ws = this.wslink.createWS(() => ws.send(rebuffer), event => {
                failed = true;
                this.onReconnectReceive(ws, event);
            }, onfailure, onfailure);
        }, 1000);
        setTimeout(onfailure, 5000);
        cc.Toast('网络不稳，正在重连...').show();
    },
});
