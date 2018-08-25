cc.Class({
    extends: cc.Component,

    properties: {
        animFreeze: cc.Prefab,
    },

    onLoad() {
        this.totalTime = 0;
        this.timeCount = 0;
    },

    play(time) {
        this.timeCount = 0;
        this.totalTime = time;
        var node = cc.instantiate(this.animFreeze);
        node.parent = this.node;
        if(this.freezeNode) {
            node.getComponent(cc.Animation).on('finished', () => node.parent = null);
        } else {
            this.freezeNode = node;
            this.node.emit('freeze-start');
        }
        cc.Sound.playSound('sFreeze');
    },

    update(dt) {
        if(!this.freezeNode) return;

        this.timeCount += dt;
        if(this.timeCount >= this.totalTime) {
            this.freezeNode.parent = null;
            this.freezeNode = null;
            this.timeCount = 0;
            this.totalTime = 0;
            this.node.emit('freeze-finish');
        }
    }
});
