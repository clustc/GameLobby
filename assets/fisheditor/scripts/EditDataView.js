cc.Class({
    extends: cc.Component,

    properties: {
        data: {
            set(data) {
                this.setData(data)
            },
            get() {
                return this.getData();
            },
            visible: false
        }
    },

    onLoad() {

    },

    bindView(key, view, setter, getter) {
        this.dataView = this.dataView || {};
        this.dataView[key] = { view: view, setter: setter, getter: getter };
    },

    clearBind() {
        this.dataView = {};
    },

    setData(data) {
        if(this.dataView) {
            for(var key in data) {
                var dv = this.dataView[key];
                if(!dv || data[key] == undefined) continue;
                dv.setter ? dv.setter(data[key]) : (dv.view.data = data[key]);
            }
        }
    },

    getData() {
        if(this.dataView) {
            var ret = {};
            for(var key in this.dataView) {
                var dv = this.dataView[key];
                if(!dv) continue;
                ret[key] = dv.getter ? dv.getter() : dv.view.data;
            }
            return ret;
        }
    },

});
