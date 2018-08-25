cc.Class({

    properties: {
        
    },

    ctor() {
        this.eventType = arguments[0];
        this.delayShowT = 0;
        this.autoHideT = 0;
        this.bindViews = [];
    },

    reset() {
        this.prepareCbk = null;
        this.triggerCbk = null;
        this.ignoredCbk = null;
        // this.cleanCbk && this.cleanCbk();
    },

    prepare() {
        this.prepareCbk && setTimeout(() => {
            this.prepareCbk && this.prepareCbk();
            if(this.delayTriggerT > 0) setTimeout(() => this.trigger(), this.delayTriggerT);
            if(this.delayIgnoredT > 0) setTimeout(() => this.ignored(), this.delayIgnoredT);
        }, this.delayPrepareT);
    },

    trigger() {
        if(this.triggerCbk) {
            this.triggerCbk();
            this.triggerCbk = null;
            this.ignoredCbk = null;
            this.cleanCbk = null;
            this.hideView();
        }
    },

    ignored() {
        if(this.ignoredCbk) {
            this.ignoredCbk();
            this.ignoredCbk = null;
            this.triggerCbk = null;
            this.cleanCbk = null;
            this.hideView();
        }
    },

    /**时间发生前 */
    onPrepare(cbk, delay) {
        this.prepareCbk = cbk.bind(this);
        this.delayPrepareT = (delay || 0) * 1000;
        return this;
    },

    /**事件发生时 */
    onTrigger(cbk, delay) {
        this.triggerCbk = cbk.bind(this);
        this.delayTriggerT = (delay || 0) * 1000;
        return this;
    },

    /**事件没触发 */
    onIgnored(cbk, delay) {
        this.ignoredCbk = cbk.bind(this);
        this.delayIgnoredT = (delay || 0) * 1000;
        return this;
    },

    onClean(cbk) {
        this.cleanCbk = cbk.bind(this);
        return this;
    },

    bindView(node) {
        this.bindViews.push(node);
    },

    hideView() {
        for(var i in this.bindViews) this.bindViews[i].parent = null;
    }
});
