cc.Class({
    extends: cc.Component,

    properties: {
        exitRoom: cc.Node,
        exitGame: cc.Node,
    },

    onLoad() {
    },

    init(name) {
        if (name === 'exitRoom') {
            this.exitRoom.active = true;
        } else if (name === 'exitGame') {
            this.exitGame.active = true;
        }
    },

    onExitRoom() {
        this.node.emit('close', true);
    },

    onExitGame() {
        // this.node.emit('close', true);
        cc.Proxy('exit').called();
    },

    onClosePop() {
        this.node.emit('close');
    },
});
