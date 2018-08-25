cc.Class({
    extends: cc.Component,

    properties: {
        data: {
            get() {
                if(this.values) return this.values[this.order];
            },
            set(value) {
                if(this.values) {
                    this.order = this.values.indexOf(value);
                    this.label.string = this.texts[this.order];
                }
            },
            visible: false
        }
    },

    init(texts, values) {
        this.texts = texts;
        this.values = values;
        this.order = 0;
        this.node.on('click', this.onClick, this);
        this.label = this.node.getComponent(cc.Label);
        this.label.string = this.texts[this.order];
    },

    onClick() {
        this.order++;
        if(this.order >= this.texts.length) this.order = 0;
        this.label.string = this.texts[this.order];
        
        this.node.emit('input-change', this.data);
    },
});
