cc.Class({
    extends: cc.Component,

    properties: {

    },


    start() {
        this.node.on('click', () => {
            /*首页-马上玩*/
            ff.BuryingPoint(3401000002, {
                room_level: ff.AccountManager.roomConfig.defaultRoomId,
                sub_room_id: 0,
            });
            ff.GameManager.enterGameRoom(ff.AccountManager.roomConfig.defaultRoomId);
        })
    },
});
