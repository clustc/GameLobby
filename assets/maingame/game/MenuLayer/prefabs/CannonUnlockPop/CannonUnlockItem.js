cc.Class({
    extends: cc.Component,

    properties: {
        cannonTitle: cc.Label,
        cannonIcon: cc.Sprite,

        paoFrame: [cc.SpriteFrame],
    },

    start() {

    },

    init(data) {
        this.data = data;
        this.cannonTitle.string = data.grade;
        this.cannonIcon.spriteFrame = this.paoFrame[this.getPaoType() - 1];
    },
    
    getPaoType() {
        if (this.data.grade <= 25) return 1;
        else if (this.data.grade <= 250) return 2;
        else return 3;
    },
});
