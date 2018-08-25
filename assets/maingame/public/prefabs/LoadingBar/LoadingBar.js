cc.Class({
    extends: cc.Component,

    properties: {
        bar: cc.Node,
        light: cc.Node,
        progress: {
            default: 1,
            type: 'Float',
            range: [0, 1, 0.1],
            slide: true,
            notify() {
                this.updateProgress();
            }
        }
    },

    onLoad() {
        this.length = this.bar.width;
        this.progress = 0;
    },

    updateProgress() {
        if(this.bar) {
            var progress = cc.clamp01(this.progress);
            var length = this.length * progress;
            this.bar.x = -this.length + length;
            this.light.x = -this.length / 2 + length - 13;
            this.light.active = length > 8;
        }
    }
});
