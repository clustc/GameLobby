const TYPE = cc.Enum({
    BACKGROUND_FILL: -1,
    IPHONE_X_FIX: -1,
    HIEGHT_FIX: -1,
})

cc.Class({
    extends: cc.Component,

    properties: {
        fixType: {
            type: TYPE,
            default: TYPE.HIEGHT_FIX,
        }
    },

    onLoad() {
        this.TYPE = TYPE;
        this.setType(this.fixType);
    },

    setType(type) {
        if(CC_EDITOR) return;
        if (type === TYPE.HIEGHT_FIX) {
            if(cc.screenBoundingBox.width / cc.screenBoundingBox.height > 16 / 9)
                this.node.scaleX = this.node.scaleY = cc.screenBoundingBox.height / 750;
        } else if (type === TYPE.IPHONE_X_FIX) {
            if(require('CCGlobal').appInfo.model == 'iPhone X') {
                var widget = this.node.getComponent(cc.Widget);
                widget.left += 26 / 812 * cc.screenBoundingBox.width;
            }
        } else if (type === TYPE.BACKGROUND_FILL) {
            var sw = this.node.width;
            var sh = this.node.height;
            if(sw === 0 || sh === 0) return;
            var pw = this.node.parent.width;
            var ph = this.node.parent.height;
            if(pw / sw > ph / sh) {
                /**填充宽度 */
                this.node.scale = pw / sw;
            } else {
                this.node.scale = ph / sh;
            }
        }
    },
});
