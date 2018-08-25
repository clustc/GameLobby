cc.Class({
    extends: cc.Component,

    properties: {
        gameTTF: cc.Font,
    },

    __preload() {
        var gameTTF = this.gameTTF;
        // cc.RichText.prototype._createFontLabel = function (string) {
            // this.font = gameTTF;
            // return _ccsg.Label.pool.get(string, gameTTF, null, this.fontSize);
        // }

        // _ccsg.Label.prototype.setFontFamily = function (fontFamily) {
            // this._resetBMFont();
            // this._fontHandle = fontFamily || "Arial";
            // this._labelType = _ccsg.Label.Type.SystemFont;
            // this._blendFunc = cc.BlendFunc._alphaPremultiplied();
            // this._renderCmd._needDraw = true;
            // this._notifyLabelSkinDirty();
            // this.emit('load');
        //     console.log('--------setFontFamily----------');
        //     return this.setFontAsset(gameTTF);
        // }
    },

    onLoad() {

    },
});
