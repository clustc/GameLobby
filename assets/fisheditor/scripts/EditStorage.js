const FishData = cc.Class({
    properties: {

    },

    ctor() {

    },

    getStorageData(key) {
        var fishdata = window.localStorage.getItem('fishdata');
        if (fishdata) {
            fishdata = JSON.parse(fishdata);
            return fishdata[key] || {};
        }
        return {};
    },

    setStorageData(key, data) {
        var fishdata = window.localStorage.getItem('fishdata') || '{}';
        fishdata = JSON.parse(fishdata);
        fishdata[key] = data;
        window.localStorage.setItem('fishdata', JSON.stringify(fishdata));
    },

    getAllInfoData() {
        return this.getStorageData('FishInfo');
    },

    getAllPathData() {
        return this.getStorageData('FishPath');
    },

    getInfoData(name) {
        var data = this.getStorageData('FishInfo');
        return data[name];
    },

    getPathData(name) {
        var data = this.getStorageData('FishPath');
        return data[name];
    },

    setInfoData(name, data) {
        if (!data) return;
        var infoData = this.getStorageData('FishInfo');
        infoData[name] = data;
        this.setStorageData('FishInfo', infoData);
    },

    setPathData(name, data) {
        if (!data) return;
        var pathData = this.getStorageData('FishPath');
        pathData[name] = data;
        this.setStorageData('FishPath', pathData);
    },

    removeInfoData(name) {
        var infoData = this.getStorageData('FishInfo');
        if (infoData[name]) {
            delete infoData[name];
            this.setStorageData('FishInfo', infoData);
        }
        var pathData = this.getStorageData('FishPath');
        if (pathData[name]) {
            delete pathData[name];
            this.setStorageData('FishPath', pathData);
        }
    },

    removePathData(name, index) {
        var pathData = this.getStorageData('FishPath');
        if (pathData[name]) {
            pathData[name].splice(index, 1);
            this.setStorageData('FishPath', pathData);
        }
    },
});

module.exports = new FishData();