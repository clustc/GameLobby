cc.Class({
    extends: cc.Component,

    properties: {
        loadingBar: require('LoadingBar'),
        loadingText: cc.Label,
        Bg:cc.Sprite
    },

    onLoad() {
        cc.Transfer = this;
        this.showX = this.node.x;
        this.loadingBar.node.active = false;
        this.node.on('touchstart', event => event.stopPropagation(), this);
        this.hide();
    },

    show() {
        // this.node.x = this.showX;
        this.node.active = true;
    },

    hide() {
        // this.node.x = 10000;
        this.node.active = false;
        this.loadingBar.node.active = false;
    },

    setText(text) {
        this.loadingText.string = text;
    },

    setProgress(progress) {
        this.loadingBar.node.active = true;
        this.loadingBar.progress = progress;
    }
});
