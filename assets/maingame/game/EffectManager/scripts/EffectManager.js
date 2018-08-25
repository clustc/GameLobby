cc.Class({
    extends: cc.Component,

    properties: {
        animWarning: cc.Prefab,
        animBossCome: cc.Prefab,
        animVipEnter: cc.Prefab,
        animShoalCome: cc.Prefab,
    },

    onLoad() {
        this.animWarning = this.initAnim(this.animWarning);
        this.animVipEnter = this.initAnim(this.animVipEnter);
        // this.animBossCome = this.initAnim(this.animBossCome);
        this.animVipEnter.on('finished', this.playVipEnter, this);
        this.vipPlayers = [];
    },

    initAnim(prefab) {
        var node = cc.instantiate(prefab);
        node.x = 100000;
        node.parent = this.node;
        var anim = node.getComponent(cc.Animation);
        anim.on('finished', () => node.x = 10000);
        return anim;
    },

    playWarning() {
        this.animWarning.node.x = 0;
        this.animWarning.play().repeatCount = 5;
        cc.Sound.playSound('sWarning');
    },

    onShoalComing() {
        var node = cc.instantiate(this.animShoalCome);
        node.x = this.node.width / 2;
        node.y = 0;
        node.getComponent(cc.Animation).on('finished', () => node.parent = null);
        node.parent = this.node;
        if(!ff.FishManager.isState(ff.FishManager.STATE.FLIPXY)) {
            node.x *= -1;
            node.scaleX *= -1;
            node.find('yuchaolailing/yuchao_0000_wenzi').scaleX *= -1;
        }
    },

    onBossComing(value) {
        this.playWarning();
        // this.animBossCome.play();
        // this.animBossCome.node.x = 0;
        // this.animBossCome.node.find('boss_0000_bosslaixi_wenzi/label', cc.Label).string = value;
    },

    onVipEnter(data) {
        if(this.vipPlayers.length === 0) this.scheduleOnce(this.playVipEnter, 0);
        this.vipPlayers.push(data);
    },

    playVipEnter() {
        var data = this.vipPlayers.shift();
        if(data) {
            var node = this.animVipEnter.node;
            var head = node.find('boss_0000_bosslaixi_wenzi/vip_0002_touxiangkuang/userHead', cc.Sprite);
            var name = node.find('boss_0000_bosslaixi_wenzi/vip_0004_mingzi_wanjia', cc.RichText);
            var level = node.find('boss_0000_bosslaixi_wenzi/vip_0001_2', cc.Label);
            head.spriteFrame = ff.ConstAssets.headImages[0];
            head.loadImage(data.photo);
            name.string = data.name + '<color=#FFEB00>进场</>';
            level.string = data.vipLevel;
            this.animVipEnter.play();
            this.animVipEnter.node.x = 0;
        }
    }
});
