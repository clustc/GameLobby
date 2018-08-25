cc.Class({
    extends: require('WebSocketMsg'),

    properties: {

    },

    ctor() {
        this.init(1);
    },

    emit(message, detail) {
        if(detail.code === 0) this._super(message, detail);
        else ff.WSLinkManager.onBreakoff(cc.Linker.ErrorCode[detail.code]);
    },

    parseBuffer(dataView) {
        this.getHeader(dataView);
        var ret = {};
        var config = this.getBufferConfig();
        for(var i in config) {
            ret[i] = this.getValue(config[i]);
            if(i == 'code' && ret[i] !== 0) break;
        }
        ret.code === 0 && (ret = this.parseReceive(ret));
        cc.log('WS RECEIVE => ', ret);
        return ret;
    },

    getParamConfig() {
        return {
            accessToken: 'string',
            enterRoomId: 'int',
            cannonLevel: 'int',
            selectRoomId: 'int'
        };
    },

    getBufferConfig() {
        return {
            code: 'short',
            playerId: 'int',
            roomId: 'int',
            timestamp: 'int',
            freezeTime: 'int',
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
            playerExtras: {
                isNoble: 'byte',
                skinId: 'short'
            }
        };
    },

    parseReceive(data) {
        cc.log('room enter player  '+JSON.stringify(data));
        var players = data.roomPlayers;
        var extras = data.playerExtras;
        for(var i in players) {
            if(players[i].id == data.playerId) {
                data.playerPlace = players[i].place;
            }
            for(var key in extras[i]) {
                players[i][key] = extras[i][key];
            }
        }
        return data;
    }
});
