cc.Class({
    extends: require('PoolLayer'),

    properties: {
        awardWheel: cc.Prefab,
        awardCoins: cc.Prefab,
        bigRichPop: cc.Prefab,
        bigWinPop: cc.Prefab,
        upgradePop: cc.Prefab,
    },

    onLoad() {
        //用户升级数据列表
        this.propList = [];
        this.prepareObject(2);
        this.awardCoins = this.initAnim(this.awardCoins);
        this.bigWinPop = this.initAnim(this.bigWinPop);
        this.bigRichPop = this.initAnim(this.bigRichPop);
        this.bigWinPop.node.addComponent('WidgetFix');
        this.bigRichPop.node.addComponent('WidgetFix');
        this.upgradePop = this.node.addScriptNode(this.upgradePop);
        this.upgradePop.node.x = this.upgradePop.node.y = 100000;
    },

    initAnim(prefab) {
        var node = cc.instantiate(prefab);
        node.x = 100000;
        node.parent = this.node;
        var anim = node.getComponent(cc.Animation);
        anim.on('finished', () => node.x = 10000);
        return anim;
    },

    createObject() {
        var node = cc.instantiate(this.awardWheel);
        node.x = node.y = 100000;
        node.parent = this.node;
        var wheel = node.getComponent('AwardWheel');
        wheel.animation.on('finished', () => this.reclaim(wheel));
        return wheel;
    },

    resetObject(object) {
        object.node.x = object.node.y = 100000;
    },

    onCaughtAwardFish(data) {
        var wheel = this.produce();
        wheel.node.position = data.battery.getAwardAnimPosition();
        wheel.show(data.fish.info.name, data.gainCoins);
        cc.Sound.playSound('sAwardWheel');
    },

    onCaughtSpecialFish(data) {
        if(data.battery === ff.ControlManager.battery) {
            this.bigRichPop.node.x = 0;
            this.bigRichPop.play();
            this.updateCountText(this.bigRichPop.node.find('80000', cc.Label), data.gainCoins)();
        } else {
            this.playSamllAnim(data.battery, this.bigRichPop.node).find('80000', cc.Label).string = data.gainCoins;
        }
    },

    onCaughtBossFish(data) {
        if(data.battery === ff.ControlManager.battery) {
            this.bigWinPop.node.x = 0;
            this.bigWinPop.play();
            this.updateCountText(this.bigWinPop.node.find('80000', cc.Label), data.gainCoins)();
        } else {
            this.playSamllAnim(data.battery, this.bigWinPop.node).find('80000', cc.Label).string = data.gainCoins;
        }
    },

    updateCountText(label, count) {
        label.string = 0;
        var num = 0;
        var func = (dt) => {
            num += dt / 1.6 * count;
            if(num >= count) {
                num = count;
                this.unschedule(func, this);
            }
            label.string = Math.ceil(num);
        }
        return () => this.schedule(func, 0.016);
    },

    playSamllAnim(battery, prefab) {
        var node = cc.instantiate(prefab);
        node.parent = this.node;
        node.scaleX = node.scaleY = 0.4;
        node.position = battery.getAwardAnimPosition();
        node.getComponent(cc.Animation).on('finished', () => { node.parent = null; });
        return node;
    },

    playBoomCoins(position) {
        cc.Sound.playSound('sCoinsBoom');
        this.awardCoins.node.position = position;
        this.awardCoins.play();
    },

    onLevelUpgrade(props) {
        this.propList.push(props);
        this.scheduleOnce(() => {
            var data =  this.propList.shift();
            this.upgradePop.show(data);
        }, 2);
    },

    onCaughtFish(data) {
        var type = data.fish.info.type;
        if(type === 'AWARD') {
            this.playBoomCoins(data.fish.node.position);
            this.onCaughtAwardFish(data);
        } else if(type === 'SPECIAL') {
            this.onCaughtSpecialFish(data);
        } else if(type === 'BOSS') {
            this.onCaughtBossFish(data);
        }
    }
});
