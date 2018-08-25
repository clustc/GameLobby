cc.Class({
    extends: cc.Component,

    properties: {
        popups: [cc.Prefab]
    },

    onLoad() { 
        require('EditGlobal')();
        var popups = this.popups.concat();
        this.popups = {};
        for(var i in popups) {
            var p = popups[i];
            this.popups[p.name] = p;
        }
        ff.Popup = (name) => cc.Popup(this.popups[name]).openEasing(cc.easeExponentialOut());
    },
});
