cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.node.on('click', this.onClick, this);
    },

    onClick(evt) {
        this.node.dispatchEvent(new cc.Event.EventCustom('close', true));
    }
});
