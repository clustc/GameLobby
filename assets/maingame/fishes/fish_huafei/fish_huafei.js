cc.Class({
    extends: cc.Component,

    properties: {
        pieces: [cc.Node]
    },

    start() {
        this.node.parent.setLocalZOrder(280 * 100000);
    },

    showDie(cbk) {
        var index = this.pieces.length - 1;
        var finishPos = ff.ControlManager.battery.getCannonPosition();
        finishPos = finishPos.sub(this.node.parent.position);
        var flyPiece = () => {
            var piece = this.pieces[index];
            var callback = cc.place(10000, 0);
            if(index === 0 && cbk) callback = cc.callFunc(() => {
                ff.ControlManager.menuLayer.guidePiecesTips.getComponent('GuidePiecesTips').showTips();
                cbk && cbk();
            });
            piece.runAction(cc.sequence(cc.moveTo(0.8, finishPos).easing(cc.easeQuinticActionIn()), callback));
            if(--index >= 0) setTimeout(flyPiece, 300);
        }
        this.scheduleOnce(flyPiece, 1.2);
        this.node.getComponent(cc.Animation).play('huafei_die');
    },
});
