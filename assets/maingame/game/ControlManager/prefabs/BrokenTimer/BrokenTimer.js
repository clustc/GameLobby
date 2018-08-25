cc.Class({
    extends: cc.Component,

    properties: {
        txtGet: cc.Node,
        txtTime: cc.Label,
        animCoins: cc.Animation,
    },

    onLoad() {
        this.totalTime = -1;
        this.secondTimer = 0;
    },

    setTotalTime(time) {
        this.totalTime = time;
        this.txtTime.string = this.getTimeString(this.totalTime);
    },

    getTimeString(seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        mins < 10 && (mins = '0' + mins);
        secs < 10 && (secs = '0' + secs);
        return mins + ':' + secs;
    },

    enableGetCoins() {
        this.animCoins.play();
        this.txtGet.active = true;
        this.txtTime.node.parent.active = false;
        this.node.getComponent(cc.Button).interactable = true;
    },

    update(dt) {
        if(this.totalTime < 0) return;
        this.secondTimer += dt;
        if(this.secondTimer > 1) {
            this.secondTimer -= 1;
            this.totalTime -= 1;
            if(this.totalTime >= 0) {
                this.txtTime.string = this.getTimeString(this.totalTime);
            } else {
                this.enableGetCoins();
            }
        }
    }
});
