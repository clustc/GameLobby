cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad() {
        this.views = {};
        this.battery = this.node.getComponent('CannonBattery');
    },
    
    onDestroy() {
        for (var i in this.views) {
            var view = this.views[i];
            view.node ? view.node.parent = null : view.parent = null;
        }
    },

    setTextView(prefab, once) {
        var node = cc.instantiate(prefab);
        node.position = this.battery.getAwardAnimPosition();
        node.parent = this.node.parent;
        once && node.getComponent(cc.Animation).on('finished', () => node.parent = null);
        this.views.text = node;
    },
    
    init(prop, time) {
        this.prop = prop;
        this.currTime = 0;
        this.totalTime = time;
        this.battery.onPropStart(this);
    },

    bindButton(button) {
        this.button = button;
        this.button.startCool();
    },

    update(dt) {
        if(!this.prop) return;
        
        this.currTime += dt;
        if(this.currTime > this.totalTime) {
            this.button && this.button.endCool();
            this.battery.onPropFinish(this);
            this.destroy();
        } else {
            this.button && this.button.updatePercent(1 - this.currTime / this.totalTime);
        }
    },
});
