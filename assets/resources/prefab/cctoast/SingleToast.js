const SingleToast = cc.Class({
    
    extends: cc.EventTarget,

    properties: {

    },

    statics: {
        defaultStyle: 'ToastDefault'
    },

    ctor() {
        this.message = arguments[0];
        this.position = cc.p(0, 0);
        this.toastPrefab = cc.Toast.toastStyles[SingleToast.defaultStyle];
    },

    setStyle(style) {
        if(!this.message) return this;
        this.toastPrefab = cc.Toast.toastStyles[style];
        return this;
    },

    setPosition(pos) {
        if(!this.message) return this;
        this.position = pos;
        return this;
    },

    show() {
        if(!this.message) return;
        var toast = cc.instantiate(this.toastPrefab);
        var label = toast.getChildByName('message');
        label.getComponent(cc.Label).string = this.message;
        toast.parent = cc.Toast.node;
        toast.position = this.position;
        this.animateShow(toast, () => {
            toast.runAction(cc.sequence(
                cc.delayTime(1.5),
                cc.fadeOut(0.5),
                cc.callFunc(() => toast.parent = null)));
        })
    },

    showDialog(okCbk, noCbk) {
        if(!this.message) return;
        var name = 'ToastDialogPop';
        this.toastPrefab = cc.Toast.toastStyles[name];
        var node = cc.instantiate(this.toastPrefab);
        var pop = node.getComponent(name);
        node.position = this.position;
        node.parent = cc.Toast.node;
        node.on('close', event => {
            node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(() => node.parent = null)));
            event.stopPropagation();
        }, this);
        pop.setTitle(this.message);
        pop.onEnsure(okCbk);
        pop.onCancel(noCbk);
        this.animateShow(node);
        cc.Waiting.hide();
    },

    animateShow(node, cbk) {
        var showY = node.y;
        node.y -= 40;
        node.opacity = 0;
        node.runAction(cc.fadeIn(0.3));
        node.runAction(cc.sequence(
            cc.moveTo(0.3, node.x, showY).easing(cc.easeSineOut()),
            cc.callFunc(cbk)
        ))
    },

});
