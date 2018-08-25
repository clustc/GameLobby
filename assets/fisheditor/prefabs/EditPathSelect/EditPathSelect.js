cc.Class({
    extends: cc.Component,

    properties: {
        itemNode: cc.Node,
        data: {
            set(data) {
                if(this.selectItem) this.selectItem.data = data;
            },
            get() {
                if(this.selectItem) return this.selectItem.data;
            },
        }
    },

    onLoad() {
        this.itemNode.parent = null;
    },

    forEveryItem(cbk) {
        var childs = this.node.children;
        for(var i = 0; i < childs.length; i++) {
            var item = childs[i].getComponent('EditPathSelectItem');
            cbk && cbk(item);
        }
    },

    itemCount() {
        return this.node.children.length;
    },

    addItem(data) {
        data.edit.index = this.itemCount();
        var node = cc.instantiate(this.itemNode);
        var item = node.getComponent('EditPathSelectItem');
        node.parent = this.node;
        item.init(data);
        this.onSelectItem(item);
    },

    onSelectItem(item) {
        this.selectItem = item;
        this.node.emit('select-change', item.data);
    },

    onDeleteItem(item) {
        var index = item.data.edit.index;
        item.node.parent = null;
        if(item == this.selectItem) this.selectItem = null;
        this.forEveryItem(item => {
            var index = this.node.children.indexOf(item.node);
            item.data.edit.index = index;
        });
        return index;
    }
});
