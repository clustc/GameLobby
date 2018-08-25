cc.Class({
    extends: cc.Component,

    properties: {
        slider: cc.Slider,
        progressBar: cc.Node,
        progressBg: cc.Node,
        progress: {
            set(v) {
                if(this.slider) {
                    this.slider.progress = v;
                    this.progressBar.width = v * this.progressBg.width;
                }
            },
            get() {
                if(this.slider) {
                    return this.slider.progress;
                }
            }
        }
    },

    onLoad() {
        this.node.on('slide', this.onSlide, this);
    },

    onSlide() {
        this.progressBar.width = this.slider.progress * this.progressBg.width;
    }
});
