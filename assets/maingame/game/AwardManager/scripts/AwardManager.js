var AwardArea = null;

cc.Class({
    extends: cc.Component,

    properties: {
        awardCoins: cc.Prefab,
        awardLabels: cc.Prefab,
        awardProps: cc.Prefab,
        awardPopups: cc.Prefab,
    },

    onLoad() {
        this.awardCoins = this.node.addScriptNode(this.awardCoins);
        this.awardProps = this.node.addScriptNode(this.awardProps);
        this.awardLabels = this.node.addScriptNode(this.awardLabels);
        this.awardPopups = this.node.addScriptNode(this.awardPopups);
        AwardArea = cc.screenBoundingBox.clone();
        AwardArea.width -= 400;
        AwardArea.height -= 300;
        AwardArea.center = this.node.position;
    },

    getAwardPosition(pos) {
        if(pos.x < AwardArea.xMin) pos.x = AwardArea.xMin;
        else if(pos.x > AwardArea.xMax) pos.x = AwardArea.xMax;
        if(pos.y < AwardArea.yMin) pos.y = AwardArea.yMin;
        else if(pos.y > AwardArea.yMax) pos.y = AwardArea.yMax;
        return pos;
    },

    onBulletHitFish(data) {
        if(data.isCaught) {
            data.fish.showDie();
            data.position = this.getAwardPosition(data.fish.node.position);
            if(data.props.length > 0) this.scheduleOnce(() => {
                this.awardProps.onDropProps(data)
            }, 1);
            if(data.fish.info.type != 'NORMAL') {
                ff.FishManager.node.animateShake();
                this.awardPopups.onCaughtFish(data);
            }
            if(data.gainCoins > 0) {
                this.scheduleOnce(() => {
                    this.awardCoins.onGainCoins(data);
                    this.awardLabels.onCaughtFish(data);
                }, 0.6);
            }
        } else if (data.props.length > 0) {
            data.position = this.getAwardPosition(data.fish.node.position);
            this.awardProps.onDropProps(data);
        }
    },
});
