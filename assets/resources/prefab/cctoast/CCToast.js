const SingleToast = require('SingleToast');

var CURRENT_MESSAGE = null;

cc.Class({
    extends: cc.Component,

    properties: {
        toastStyles: [cc.Prefab],
    },

    onLoad() {
        cc.Toast = (message) => this.showToast(message);

        var styles = this.toastStyles.concat();
        this.toastStyles = {};
        for(var i in styles) {
            var style = styles[i];
            this.toastStyles[style.name] = style;
        }
        cc.Toast.node = this.node;
        cc.Toast.toastStyles = this.toastStyles;
    },

    showToast(message) {
        if(message === CURRENT_MESSAGE || !message) return new SingleToast();
        CURRENT_MESSAGE = message;
        this.unschedule(this.resetMessage);
        this.scheduleOnce(this.resetMessage, 2);
        return new SingleToast(message);
    },

    resetMessage() {
        CURRENT_MESSAGE = null;
    }
});
