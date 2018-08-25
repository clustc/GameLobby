const FishInfo = require('FishData').FishInfo;
const FishPath = require('FishData').FishPath;
cc.Class({
    extends: cc.Component,

    properties: {
        pathInfo: cc.Prefab,
        newPath: cc.Node,
        deletePath: cc.Node,
        savePath: cc.Node,
        pathSelect: require('EditPathSelect'),
        pathPoints: require('EditPathPoints'),
    },

    onLoad() {
        this.pathInfo = cc.instantiate(this.pathInfo).getComponent('EditPathInfo');
        this.pathInfo.node.x += 50;
        this.pathInfo.node.parent = this.newPath.parent;
        this.pathInfo.node.setLocalZOrder(-1);
        this.pathInfo.node.on('input-change', this.onInputChange, this);
        this.pathSelect.node.on('select-change', this.onSelectChange, this);
        this.pathPoints.node.on('points-change', this.onPointsChange, this);
        this.newPath.on('click', this.onNewPath, this);
        this.savePath.on('click', this.onSavePath, this);
        this.deletePath.on('click', this.onDeletePath, this);
    },

    editPath(data, path) {
        this.data = data;
        this.newPath.active = false;
        this.pathInfo.node.active = false;
        for(var i in path) {
            var d = this.copyData(this.data);
            d.path = path[i];
            d.edit = { type: 'move' };
            this.pathSelect.addItem(d);
        }
    },

    init(data) {
        this.data = data;
    },

    copyData(data) {
        return JSON.parse(JSON.stringify(data));
    },

    getFishData() {
        var name = this.data.name;
        var infoName = this.data.info.name;
        FishInfo[infoName] = this.data.info;
        FishPath[name] = [this.pathSelect.data.path];
        if(this.data.type !== 'single') {
            FishInfo[name] = {
                name: infoName,
                group: this.data.group
            }
        }
        return { name: name, path: 0 };
    },

    getEditData() {
        var data = this.copyData(this.data);
        var path = this.pathInfo.data;
        data.edit = path;
        data.edit.type = 'move';

        /**已有路径则更新路径属性 */
        var currPath = this.pathPoints.data;
        if(currPath && this.pathPoints.count == path.count) {
            currPath.velocity = path.speed;
            currPath.stayRate = path.stayRate / 100;
            currPath.stayTime = path.stayTime / 1000;
            data.path = currPath;
        } else {
            data.path = {
                velocity: path.speed,
                stayRate: path.stayRate / 100,
                stayTime: path.stayTime / 1000
            };
        }
        return data;
    },

    onInputChange() {
        if (this.pathSelect.selectItem) {
            this.pathSelect.data = this.getEditData();
            this.onSelectChange();
        }
    },

    onSelectChange() {
        var data = this.pathSelect.data;
        this.pathPoints.data = data;
        /**更新路径属性值 */
        this.pathInfo.data = data.edit;
        if (!data.path.pointxs) data.path = this.pathPoints.data;
        ff.FishManager.onPathChange(this.getFishData());
    },

    onPointsChange() {
        this.pathSelect.data.path = this.pathPoints.data;
        ff.FishManager.onPathChange(this.getFishData());
    },

    onNewPath() {
        if (this.pathSelect.itemCount() >= 6) return;
        this.pathSelect.addItem(this.getEditData());
    },

    onSavePath() {
        if (!this.pathSelect.selectItem) return;
        /**存info */
        ff.EditStorage.setInfoData(this.data.info.name, this.data.info);
        if(this.data.type !== 'single') {
            ff.EditStorage.setInfoData(this.data.name, {
                name: this.data.info.name,
                group: this.data.group
            });
        }
        /**存path */
        var paths = [];
        this.pathSelect.forEveryItem(item => {
            var p = item.data.path;
            if(p.stayRate * p.stayTime == 0) {
                delete p.stayRate;
                delete p.stayTime;
            }
            paths.push(p);
        });
        ff.EditStorage.setPathData(this.data.name, paths);
    },

    onDeletePath() {
        this.pathSelect.onDeleteItem(this.pathSelect.selectItem);
        if (this.pathSelect.itemCount() == 0) {
            this.pathPoints.reset();
            ff.FishManager.onPathChange();
        } else {
            ff.FishManager.onPathChange(this.getFishData());
        }
    }
});
