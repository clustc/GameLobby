cc.Class({
    extends: cc.Component,

    properties: {
        data: {
            set(v) {
                this.setValue(v);
            },
            get() {
                return this.getValue();
            },
            visible: false,
        }
    },

    init(range) {
        this.range = range || cc.p(10, 100);
        this.editBox = this.node.getComponent(cc.EditBox);
        this.node.on('editing-did-ended', this.onEnd, this);
    },

    getValue() {
        if (this.editBox) {
            return parseInt(this.editBox.string);
        }
    },

    setValue(v) {
        if (this.editBox) {
            this.editBox.string = v;
        }
    },

    onEnd() {
        if (!/^[0-9]*$/.test(this.editBox.string)) return;

        var num = parseInt(this.editBox.string);
        if (num < this.range.x) {
            num = this.range.x;
            this.editBox.string = this.range.x;
        }
        if (num > this.range.y) {
            num = this.range.y;
            this.editBox.string = this.range.y;
        }
        this.node.emit('input-change', this.data);
    },

});
