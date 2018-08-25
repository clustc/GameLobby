const SinglePopup = require('SinglePopup');

cc.Class({
    extends: cc.Component,

    properties: {
        shadow: cc.SpriteFrame
    },

    onLoad() {
        cc.Popup = (name) => { return new SinglePopup(name); }
        cc.Popup.clearPopups = () => (this.clearPopups());
        cc.Popup.createShadow = () => (this.createShadow());

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    onKeyUp: function (event){
        if (event.keyCode === cc.KEY.back){
            if (cc.director.getScene().name === 'GameScene'){
                cc.director.loadScene('GameLobbyScene');
            }else if (cc.director.getScene().name === 'GameLobbyScene'){
                cc.Popup('GameExitPop').show();
            }
        }
    },
    createShadow() {
        var node = new cc.Node();
        var spt = node.addComponent(cc.Sprite);
        var wgt = node.addComponent(cc.Widget);
        spt.spriteFrame = this.shadow;
        spt.type = cc.Sprite.Type.SLICED;
        wgt.isAlignTop = wgt.isAlignBottom = true;
        wgt.isAlignLeft = wgt.isAlignRight = true;
        wgt.top = wgt.bottom = wgt.left = wgt.right = 0;
        node.color = cc.color(0, 0, 0);
        node.cascadeOpacity = false;
        node.opacity = 160;
        node.parent = this.node;
        return node;
    },

    clearPopups() {
        var shadows = this.node.children;
        for(var i in shadows) shadows[i].children[0].emit('close');
    },
    onDestroy: function () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
});
