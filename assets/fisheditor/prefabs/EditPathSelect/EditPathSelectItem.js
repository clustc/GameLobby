cc.Class({
    extends: cc.Component,

    properties: {
        data: {
            get() {
                return this.getData();
            },
            set(data) {
                this.setData(data);
            },
            visible: false,
        }
    },

    onLoad() {

    },

    init(data) {
        this.node.getComponent(cc.Toggle).check();
        this.itemLabel = this.node.find('label', cc.Label);
        this.data = data;
        this.node.on('toggle', this.onToggle, this);
    },

    getData() {
        if(this.itemLabel) {
            return this.itemData;
        }
    },

    setData(data) {
        if(this.itemLabel) {
            this.itemLabel.string = data.name;
            this.itemData = data;
        }
    },

    onToggle() {
        this.node.parent.getComponent('EditPathSelect').onSelectItem(this);
    },

    getShoalData() {
        var rets = [];
        var emit = this.itemData.emit;
        var path = this.itemData.path;
        /**根据运动总时间和运动间隔求出最小的速度 */
        var count = (emit.duration - ff.GetMoveDuration(path)) / emit.interval;
        count = Math.max(count, 10);
        var velocity = ff.GetMoveLongness(path) / (emit.duration - emit.interval * count);
        path.velocity = Math.max(velocity, path.velocity);

        this.itemData.group.index = [0, Math.floor(count)];
        var data = {
            name: this.itemData.name,
            group: this.itemData.group,
            path: path
        }
        rets.push(data);
        if(emit.doubleX) {
            var d = JSON.parse(JSON.stringify(data));
            for(var i in d.path.pointxs) d.path.pointxs[i] *= -1;
            rets.push(d);
        }
        if(emit.doubleY) {
            var d = JSON.parse(JSON.stringify(data));
            for(var i in d.path.pointys) d.path.pointys[i] *= -1;
            rets.push(d);
        }
        return rets;
    }
});
