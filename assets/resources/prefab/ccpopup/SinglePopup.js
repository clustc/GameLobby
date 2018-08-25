var ShownPopups = {};

cc.Class({
    properties: {

    },

    ctor() {
        this.isOutsideClose = true;
        this.isSwallowTouch = true;
        this.shadowOpacityValue = 155;
        this.openEasingEffect = cc.easeBackOut();
        if(typeof(arguments[0]) === 'string') {
            /**是名字 */
            this.popupName = arguments[0];
            this.popupPrefab = null;
        } else {
            /**是预制体 */
            this.popupPrefab = arguments[0];
            this.popupName = this.popupPrefab.name;
        }
    },

    openEasing(ease) {
        this.openEasingEffect = ease;
        return this;
    },

    shadowOpacity(opacity) {
        this.shadowOpacityValue = opacity;
        return this;
    },

    swallowTouch(swallow) {
        this.isSwallowTouch = swallow;
        return this;
    },

    outsideClose(close) {
        this.isOutsideClose = close;
        return this;
    },

    show(showCbk, hideCbk) {
        if(ShownPopups[this.popupName]) return;
        ShownPopups[this.popupName] = this.popupName;

        this.showCbk = showCbk;
        this.hideCbk = hideCbk;
        
        if(this.popupPrefab) {
            this.openPopup(this.popupPrefab);
        } else {
            cc.loadRes('pops/' + this.popupName, res => this.openPopup(res));
        }
    },

    openPopup(popupPrefab) {
        var shadow = cc.Popup.createShadow();
        var popup = cc.instantiate(popupPrefab);
        shadow.addComponent('WidgetFix');
        popup.parent = shadow;
        popup.scaleX = popup.scaleY = 0.6;
        popup.runAction(cc.scaleTo(0.3, 1).easing(this.openEasingEffect));
        popup.on('close', event => {
            this.closePopup(popup, event.detail);
            event.stopPropagation();
        }, this);
        shadow.opacity = this.shadowOpacityValue;
        if(this.isSwallowTouch) {
            popup.on('touchstart', event => event.stopPropagation());
            shadow.on('touchstart', event => {
                this.isOutsideClose && popup.emit('close');
                event.stopPropagation();
            }, this);
        }
        if(this.showCbk) {
            /**有脚本返回脚本，没有则返回节点 */
            var script = popup.getComponent(popup.name);
            if(!script) this.showCbk(popup);
            else {
                this.showCbk(script);
                this.delayShow(script, shadow);
            }
        }
        cc.Sound.playSound('sPopOpen');
    },

    delayShow(script, shadow) {
        var widget = shadow.getComponent(cc.Widget);
        widget.left = 100000;
        widget.right = -widget.left;
        script.scheduleOnce(() => shadow.x = 0, 0);
    },

    closePopup(popup, data) {
        if (popup.parent.getNumberOfRunningActions() > 0) return;
        delete ShownPopups[this.popupName];
        cc.Sound.playSound('sPopClose');
        popup.runAction(cc.scaleTo(0.2, 0.6, 0.6).easing(cc.easeExponentialIn()));
        popup.parent.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(() => {
            popup.parent.destroy();
            this.hideCbk && this.hideCbk(data);
        })));
    }
});
