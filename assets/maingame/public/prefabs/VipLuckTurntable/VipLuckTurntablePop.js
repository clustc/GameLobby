cc.Class({
    extends: cc.Component,

    properties: {
        turntable: cc.Node,
        drawCoin: cc.Label,
        remind: cc.Label,

        bgAnim: cc.Node,
        awardAnim: cc.Node,

        close: cc.Button,
        drawBtn: cc.Button,


    },

    onLoad() {
        this.isEnd = true,
            this.isDraw = false,
            this.awardData = null;
        this.isVipDraw = false;
        this.awardAnim.parent = null;
        this.initView();
    },

    start() {
        this.node.parent.on('touchstart', this.onClosePop, this);
    },

    initView() {
        // ff.AccountManager.shopConfig.refreshVipDrawData((data) => {
        //     this.drawCoin.string = data.fee;
        //     this.setRemind(data.remind);
        //     this.initItem(data.config);
        // }, 'isLoading')
    },

    setRemind(remind) {
        this.remind.string = remind + '次';
    },

    initItem(data) {
        this.drawData = data;
        for (var i = 0; i < data.length; i++) {
            var propsConfig = ff.AccountManager.propsConfig;
            if (!this.turntable.children[i]) return;
            var name = data[i].propId == 2 ? propsConfig.getPropById(data[i].propId).propName + 's' : propsConfig.getPropById(data[i].propId).propName;
            var propNum = data[i].propId == 3 ? String(data[i].propNum / 10).replace('.', ';') : data[i].propNum;
            this.turntable.children[i].getChildByName('AwardIcon').scale = data[i].propId == 2 ? 0.8 : 1;
            this.turntable.children[i].getChildByName('AwardIcon').getComponent(cc.Sprite).spriteFrame = propsConfig.getSpriteByName(name);
            this.turntable.children[i].getChildByName('AwardAmount').getComponent(cc.Label).string = propNum;
            this.turntable.children[i].awardId = data[i].rewardId;
        }
    },

    onDraw() {
        if (this.isDraw || !this.isEnd) return;
        this.isDraw = true;
        this.isEnd = false;
        // cc.Linker('GetVipDraw').request((data) => {
        //     this.isVipDraw = true;
        //     this.awardData = data;
        //     this.startBetting(data);
        //     this.setRemind(data.remind);
        // }, () => {
        //     this.isDraw = false;
        //     this.isEnd = true;
        // });
    },

    startBetting: function (msg) {
        var index = null;
        var element = null;
        for (var i = 0; i < this.turntable.children.length; i++) {
            element = this.turntable.children[i];
            if (element.awardId === msg.drawId) {
                index = i;
                this.runDrawAction(index, element);
                break;
            }
        }
    },

    runDrawAction(index, node) {
        var lastRotation = 360 - this.turntable.rotation % 360;
        var awardAnim = this.awardAnim.getComponent(cc.Animation);
        var bgAnim = this.bgAnim.getComponent(cc.Animation);
        this.turntable.runAction(cc.sequence(
            cc.rotateBy(3, 4 * 360 - (30 + index * 60 - lastRotation) + Math.rand(-20, 20)).easing(cc.easeQuadraticActionInOut()),
            cc.callFunc(() => {
                this.awardAnim.parent = node;
                this.awardAnim.x = 0;
                this.awardAnim.y = 0;
                this.awardAnim.rotation = 0;
                awardAnim.play('AwardAnim');
                awardAnim.on('finished', () => {
                    bgAnim.play('BgAnim');
                    bgAnim.on('finished', () => {
                        this.awardAnim.parent = null;
                        this.showAwardTips();
                    }, this)
                }, this)
            }),
        ));
    },

    showAwardTips() {
        var showData = [];
        for (var i = 0; i < this.drawData.length; i++) {
            if (this.drawData[i].rewardId == this.awardData.drawId) {
                var propNum = this.drawData[i].propId == 3 ? this.drawData[i].propNum / 10 : this.drawData[i].propNum;
                showData.push({ propId: this.drawData[i].propId, propNumAdd: propNum });
            }
        }
        ff.PopupManager.showAwardTips(showData, () => {
            this.isDraw = false;
            this.isEnd = true;
        });
    },

    onClosePop() {
        if (!this.isEnd || this.isDraw) return;
        this.node.emitEvent('close', this.isVipDraw);
    },
});
