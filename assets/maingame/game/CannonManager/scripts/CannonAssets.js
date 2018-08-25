cc.Class({
    extends: cc.Component,

    properties: {
        cannon: require('Cannon'),
        nodeStage: cc.Node,
        nodeBroken: cc.Node,
        nodeWaiting: cc.Node,
        labelLevel: cc.Label,
        labelCoins: cc.Label,
        labelJewels: cc.Label,

        locateLine: cc.Prefab,
        locateRing: cc.Prefab,
        crazyText: cc.Prefab,
        crazyRing: cc.Prefab,
        cloneRing: cc.Prefab,
        cloneText: cc.Prefab,
        freezeText: cc.Prefab,

        cannonSkins: [cc.Prefab],
        bulletSkins: [cc.SpriteFrame],
        fishnetSkins: [cc.SpriteFrame],
        cannonVipSkins: [cc.Prefab],
        bulletVipSkins: [cc.SpriteFrame],
        fishnetVipSkins: [cc.SpriteFrame],
        cannonWearSkins: [cc.Prefab],
        bulletWearSkins: [cc.SpriteFrame],
        fishnetWearSkins: [cc.SpriteFrame],
        bulletCrazySkin: cc.SpriteFrame,
    },

    init(pos) {
        this.showPosition = pos;
        this.hidePosition = pos.sub(cc.p(0, 220));
        var nodeCannon = this.cannon.node.parent;
        var coinsPanel = this.labelCoins.node.parent;
        if(pos.x > 0) coinsPanel.x = -coinsPanel.x;
        if(pos.y > 0) {
            this.nodeStage.rotation = 180;
            this.hidePosition = pos.add(cc.p(0, 220));
        }
        var factor = Math.cos(cc.degreesToRadians(this.nodeStage.rotation));
        coinsPanel.y *= factor;
        nodeCannon.y *= factor;
        this.nodeBroken.y *= factor;
        this.nodeWaiting.y *= factor;
        this.labelLevel.node.parent.y *= factor;
        this.nodeStage.on('touchstart', event => event.stopPropagation());
        this.node.position = this.hidePosition;

        this.nodeBroken.active = false;
        this.cannonPosition = pos.add(nodeCannon.position);
        this.awardAnimPosition = this.cannonPosition.add(cc.p(0, 200 * factor));
        this.awardCoinPosition = pos.add(coinsPanel.position).add(this.labelCoins.node.position);
    },

    getPropSkin(skin) {
        return {
            cannon: skin.cannon,
            bullet: this.bulletCrazySkin,
            fishnet: skin.fishnet
        }
    },
    
    getBaseSkin(level) {
        var cannons = ff.AccountManager.cannonConfig.getCannonCount(level) - 1;
        return {
            cannon: this.cannonSkins[cannons],
            bullet: this.bulletSkins[cannons],
            fishnet: this.fishnetSkins[cannons],
        }
    },

    getWearSkin(id) {
        if(id < 1000) {
            var level = id - 1;
            return {
                cannon: this.cannonVipSkins[level],
                bullet: this.bulletVipSkins[level],
                fishnet: this.fishnetVipSkins[level],
            }
        } else if (id === 1001) {
            return {
                cannon: this.cannonWearSkins[0],
                bullet: this.bulletWearSkins[0],
                fishnet: this.fishnetWearSkins[0],
            }
        }
        return this.getBaseSkin(ff.AccountManager.cannonLevel);
    }
});
