cc.Class({
    extends: cc.Component,

    properties: {
        data: {
            get() {
                return this.getData();
            },
            set(c) {
                this.setData(c);
            },
            visible: false,
        }
    },

    init(counts) {
        var toggleItem = this.node.children[0];
        toggleItem.parent = null;
        for(var i in counts) {
            var n = cc.instantiate(toggleItem);
            n.parent = this.node;
            n.on('toggle', this.onToggle, this);
            this.setItemCount(n, counts[i]);
        }
    },

    onToggle() {
        this.node.emit('input-change', this.data);
    },

    getItemCount(child) {
        return parseInt(child.find('count', cc.Label).string);
    },

    setItemCount(child, c) {
        child.find('count', cc.Label).string = c;
    },

    setData(count) {
        var childs = this.node.children;
        for(var i in childs) {
            var t = childs[i];
            if(this.getItemCount(t) == count) {
                var toggle = t.getComponent(cc.Toggle);
                toggle.isChecked = true;
                toggle._toggleContainer.updateToggles(toggle);
                break;
            }
        }
    },

    getData() {
        var childs = this.node.children;
        for(var i in childs) {
            var t = childs[i].getComponent(cc.Toggle);
            if(t.isChecked) {
                return this.getItemCount(t.node);
            }
        }
    }
});
