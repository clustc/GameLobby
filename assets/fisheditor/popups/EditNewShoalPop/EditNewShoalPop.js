
 /**
  * fish_shoal_1: {
  *     name: fish_shoal,
  *     group: [
  *         {
  *             name: 
  *             index: [],
  *             delay: 0,
  *         },
  *         {
  *             name: 
  *             index: [],
  *             delay: 0,
  *         }
  *     ]
  *     duration: 0,
  * }
  * 
  * fish_shoal_1: [
  *     [
  *         {
  *             lengths, pointxs, pointys, velocity
  *         },
  *         {
  *             lengths, pointxs, pointys, velocity
  *         }
  *     ]
  * ]
  */
const FishInfo = require('FishData').FishInfo;
const FishPath = require('FishData').FishPath;

cc.Class({
    extends: cc.Component,

    properties: {
        newLine: cc.Node,
        newSine: cc.Node,
        newRound: cc.Node,
        editPath: cc.Node,
        deletePath: cc.Node,
        saveShoal: cc.Node,
        pathSelect: require('EditPathSelect'),
        pathPoints: require('EditPathPoints'),
    },

    onLoad() {
        this.shoalName = null;
        this.newLine.on('click', () => this.showInfoPop('line'), this);
        this.newSine.on('click', () => this.showInfoPop('sine'), this);
        this.newRound.on('click', () => this.showInfoPop('round'), this);
        this.saveShoal.on('click', this.onSaveShoal, this);
        this.editPath.on('click', this.onEditPath, this);
        this.deletePath.on('click', this.onDeletePath, this);
        this.pathSelect.node.on('select-change', this.onSelectChange, this);
        this.pathPoints.node.on('points-change', this.onPointsChange, this);
    },

    init(data) {
        if(data.duration) {
            this.name = data.name;
            this.duration = data.duration;
        } else {
            FishInfo[data.name] = data.info;
            FishPath[data.name] = data.path;
            ff.FishManager.onPathChange({ name: data.name, path: 0 });
            this.saveShoal.off('click', this.onSaveShoal, this);
            this.newLine.active = false;
            this.newSine.active = false;
            this.newRound.active = false;
            this.editPath.active = false;
            this.deletePath.active = false;
        }
    },

    getFishData() {
        var data = [];
        this.pathSelect.forEveryItem(item => {
            var rets = item.getShoalData();
            for(var ii in rets) data.push(rets[ii]);
        });
        var count = 0;
        for(var i = 0; i < data.length; i++) {
            var d = data[i].group;
            if(i == 0) count = d.index[1];
            else {
                d.index[0] = count;
                count += d.index[1];
            }
        }

        var path = [];
        var group = [];
        for(var i in data) {
            var d = data[i];
            d.group.name = d.name;
            path.push(d.path);
            group.push(d.group);
        }

        FishPath[this.name] = [path];
        FishInfo[this.name] = {
            name: 'fish_shoal',
            group: group,
            duration: this.duration / 1000,
        }
        return { name: this.name, path: 0 }
    },

    onSaveShoal() {
        this.getFishData();
        ff.EditStorage.setInfoData(this.name, FishInfo[this.name]);
        ff.EditStorage.setPathData(this.name, FishPath[this.name]);
    },

    onEditPath() {
        ff.Popup('EditShoalInfoPop').show(pop => pop.init(this.data, this.duration), data => {
            if(data) {
                this.data = data;
                this.pathPoints.data = this.data;
                this.pathSelect.selectItem.itemData = this.data;
                this.data.path = this.pathPoints.data;
                ff.FishManager.onPathChange(this.getFishData());
            }
        })
    },

    onDeletePath() {
        this.pathSelect.onDeleteItem(this.pathSelect.selectItem);
        if(this.pathSelect.itemCount() == 0) {
            this.pathPoints.reset();
            ff.FishManager.onPathChange();
        } else {
            ff.FishManager.onPathChange(this.getFishData());
        }
    },

    onSelectChange(event) {
        this.data = event.detail;
        this.pathPoints.data = this.data;

        this.data.path = this.pathPoints.data;
        ff.FishManager.onPathChange(this.getFishData());
    },

    onPointsChange(event) {
        var data = this.pathPoints.movePoints.data;
        for(var key in data) this.data.edit[key] = data[key];
        this.pathSelect.data = this.data;

        this.data.path = this.pathPoints.data;
        ff.FishManager.onPathChange(this.getFishData());
    },

    showInfoPop(type) {
        if (this.pathSelect.itemCount() < 6) {
            ff.Popup('EditShoalInfoPop').show(pop => pop.init(type, this.duration), data => {
                if(data) {
                    this.pathSelect.addItem(data);
                    cc.log('>>>', data);
                }
            })
        }
    }
});
