cc.Class({
    extends: cc.Component,

    properties: {
        popName: ''
    },

    onLoad() {
        this.node.on('click', this.onClick, this);
    },

    onClick(evt) {
        cc.Popup(this.popName).show();
    }
});
