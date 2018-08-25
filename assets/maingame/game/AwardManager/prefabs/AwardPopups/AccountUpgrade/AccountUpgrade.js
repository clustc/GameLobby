cc.Class({
    extends: cc.Component,

    properties: {
        userLevel: cc.Label,
        awardAnim: cc.Animation,
        awardContent: cc.Node,
    },

    onLoad() {
        this.node.addComponent('WidgetFix');
    },

    show(props) {
        cc.Sound.playSound('sUpgrade');
        this.node.opacity = 0;
        this.node.x = this.node.y = 0;
        this.userLevel.string = ff.AccountManager.playerLevel;
        this.awardContent.active = props.length > 0;
        this.awardAnim.play();
        this.node.opacity = 255;
        this.node.runAction(cc.sequence(
            cc.fadeIn(0.1), cc.delayTime(3), cc.fadeOut(0.3),
            cc.callFunc(() => this.node.x = 100000)
        ));
        if(props.length > 0) {
            var awardProps = ff.AwardManager.awardProps;
            var startPos = this.awardContent.position.clone();
            var finishPos = ff.ControlManager.battery.getCannonPosition();
            startPos.x -= props.length / 2 * 160 - 80;
            var fly = () => {
                var prop = props.shift();
                this.flyProp(prop.propId, prop.propNum, startPos, finishPos);
                if(props.length > 0) setTimeout(fly, 100);
                startPos.x += 160;
            }
            fly();
        }
    },

    flyProp(propId, propNum, startPos, finishPos) {
        var prop = ff.AccountManager.propsConfig.getPropById(propId);
        var item = ff.AwardManager.awardProps.produce();
        item.node.parent = this.node;
        item.setIcon(prop.spriteFrame).setCount(propNum);
        item.animateFly(startPos, finishPos, 0.8, 1.8, () => item.node.parent = null);
    }
});
