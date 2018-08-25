cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel: cc.Label,
        btnOK: cc.Node,
        btnNO: cc.Node,
        btnTlg: cc.Node,
    },

    onLoad() {
        
    },

    setTitle(title) {
        this.titleLabel.string = title;
        return this;
    },

    onEnsure(cbk, target) {
        cbk && this.btnOK.on('click', cbk, target);
        return this;
    },

    onCancel(cbk, target) {
        if(cbk) {
            this.btnNO.active = true;
            this.btnNO.on('click', cbk, target);
        }
        return this;
    },

    onToggle(cbk, target) {
        if(cbk) {
            this.btnTlg.parent.active = true;
            this.btnTlg.on('toggle', cbk, target);
        }
        return this;
    }
});
