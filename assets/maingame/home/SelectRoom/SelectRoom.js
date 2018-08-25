const CCGlobal = require('CCGlobal');
const ITEM_LENGTH = 10;
var roomConfigData = null;
cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        roomItem: cc.Node,
    },

    onLoad() {
        this.roomItem.parent = null;
    },

    init(room) {
        this.recieveData = room;
        for (var i = 0; i < room.length; i++) {
            var p = cc.instantiate(this.roomItem);
            p.parent = this.content;
            p.getScript().initItem(room[i])
            p.on('click', this.onEnterRoom, this);
        }
    },

    updataData() {
        cc.Linker('GetSelectRoomConfig').request((data) => {
            this.init(data.room);
        });
    },

    //进入房间
    onEnterRoom(event) {
        var index = event.target.getSiblingIndex();
        /**首页-进入房间 */
        ff.BuryingPoint(3401000004,{
            room_level: this.recieveData[index].roomConfigId,
            sub_room_id: this.recieveData[index].id,
        })
        if (this.recieveData[index].user >= 4) {
            cc.Toast('当前房间已满哦').show();
            this.scheduleOnce(() => {
                this.updataData(false);
            }, 2.3);
        }
        else {
            this.node.emit('close');
            ff.GameManager.enterGameRoom(this.recieveData[index].roomConfigId, this.recieveData[index].id);
        }
    },
});
