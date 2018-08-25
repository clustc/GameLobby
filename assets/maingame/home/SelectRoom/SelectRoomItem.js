cc.Class({
    extends: cc.Component,

    properties: {
        roomNumber: cc.Label,
        seatText: cc.Label,
        seat: cc.Sprite,

        roomFlag:[cc.SpriteFrame],
    },

    initItem(data) {
        //  0-9 : ; < 
        //  0-9 / ( )
        this.roomNumber.string = this.node.getSiblingIndex() + 1;
        this.seatText.string = ';' + data.user + ':4<';
        this.seat.spriteFrame = this.roomFlag[data.user];
    },
});
