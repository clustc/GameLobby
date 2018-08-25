cc.Class({
    extends: cc.Component,

    properties: {
        item: cc.Node,
    },

    onLoad() {
        this.container = this.item.parent;
        this.item.parent = null;

        var data = ff.EditStorage.getAllInfoData();
        var click = event => {
            var item = event.target.getComponent('EditAllPathItem');
            this.node.emit('close', {
                name: item.name,
                info: item.info,
                path: item.path
            });
        }
        for(var name in data) {
            var path = ff.EditStorage.getPathData(name);
            if(!path) continue;
            var info = ff.EditStorage.getInfoData(name);
            var node = cc.instantiate(this.item);
            node.parent = this.container;
            node.getComponent('EditAllPathItem').init(name, info, path);
            node.on('click', click);
        }
    },
});
