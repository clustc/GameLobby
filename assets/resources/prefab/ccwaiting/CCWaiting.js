cc.Class({
    extends: cc.Component,

    properties: {
        loading: cc.Node,
        txtTips: cc.Label,
    },

    onLoad() {
        cc.Waiting = this;
        this.showX = this.node.x;
        this.loadCount = 0;
        this.scheduleOnce(this.init, 0);
        this.node.on('touchstart', event => event.stopPropagation(), this);
    },

    init() {
        this.show();
        this.hide();
    },

    updateLoading() {
        this.loading.rotation -= 360 / 8;
    },

    show(tips) {
        tips ? this.showToast(tips) : this.showLoading();
    },

    hide() {
        this.txtTips.node.parent.active ? this.hideToast() : this.hideLoading();
    },
    
    cancel() {
        this.node.x = 10000;
        this.unschedule(this.updateLoading);
    },

    showToast(tips) {
        this.txtTips.string = tips;
        this.loading.active = false;
        this.txtTips.node.parent.active = true;
        this.node.x = this.showX;
    },

    hideToast() {
        this.node.x = 10000;
    },

    showLoading() {
        this.loadCount++;
        if(this.loadCount > 1) return;
        this.schedule(this.updateLoading, 0.1);
        this.node.x = this.showX;
        this.loading.active = true;
        this.txtTips.node.parent.active = false;
    },

    hideLoading() {
        this.loadCount = Math.max(this.loadCount - 1, 0);
        if(this.loadCount > 0) return;
        this.node.x = 10000;
        this.unschedule(this.cancel);
        this.unschedule(this.updateLoading);
    },
});
