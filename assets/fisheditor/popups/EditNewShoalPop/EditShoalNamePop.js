cc.Class({
    extends: cc.Component,

    properties: {
        shoalName: cc.EditBox,
        shoalDuration: cc.EditBox,
        btnClose: cc.Node,
    },

    onLoad() { 
        this.btnClose.on('click', this.onClickClose, this);
    },

    onClickClose() {
        if(!this.shoalName.string) return;
        if(!parseInt(this.shoalDuration.string)) return;
        this.node.emit('close', {
            name: this.shoalName.string,
            duration: parseInt(this.shoalDuration.string),
        });
    }
});
