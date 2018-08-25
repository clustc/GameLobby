cc.Class({
    extends: cc.Component,

    properties: {
        showWaiting: false,
        prefabPaths: [cc.String]
    },

    start() {
        var loadFunc = (i) => {
            this.showWaiting && cc.Waiting.show();
            cc.loadRes(this.prefabPaths[i], res => {
                this.showWaiting && cc.Waiting.hide();
                this.node.emit('prefab-loaded', res);
                if (++i < this.prefabPaths.length) loadFunc(i);
                else this.node.emit('prefab-all-loaded');
            })
        }
        loadFunc(0);
    },
});