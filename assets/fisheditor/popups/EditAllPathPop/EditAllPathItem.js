cc.Class({
    extends: cc.Component,

    properties: {
        txtName: cc.Label,
        txtInfo: cc.Label,
        delete: cc.Node,
    },

    onLoad() {
        this.delete.on('click', this.onDelete, this);
    },

    init(name, info, path) {
        this.name = name;
        this.info = info;
        this.path = path;

        if(name === info.name) {
            this.parseText(name, '单鱼', path.length + ' 条路径');
        } else if (info.name === 'fish_shoal') {
            this.parseText(name, '鱼潮', info.duration + 's 时长');
        } else if(info.group.delay){
            this.parseText(name, '队列', info.name + ' × ' + info.group.index[1]);
        } else if(info.group.offsets) {
            this.parseText(name, '组合', info.name + ' × ' + info.group.index[1]);
        }
    },

    onDelete() {
        this.node.parent = null;
        ff.EditStorage.removeInfoData(this.name);
    },

    parseText(name, type, info) {
        this.txtName.string = name;
        this.txtInfo.string = type + '        ' + info;
    }
});
