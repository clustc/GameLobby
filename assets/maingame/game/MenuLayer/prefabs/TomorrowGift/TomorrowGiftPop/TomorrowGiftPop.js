cc.Class({
    extends: cc.Component,

    properties: {
        awardItem: [cc.Node],
        loginDays: [cc.Node],
        drawBtn: cc.Button,
        drawTicket: cc.Node,
        drawTicketAmount: cc.Label,
        countDown: cc.Label,

        drawAnim: cc.Animation,
        rewardAnim: cc.Node,

        _startDraw: false,
        _endDraw: true,
        _curPos: 0,
        _delayTime: 0,
        _rewardId: 0,
    },

    onLoad() {
        this._valid = true;
        this._script = null;
        this.tickets = 0;
        this.rewardData = null;

        this.tomorrowBtn = null;
        this.tomorrowData = null;
        this.cleanRewardAnim();
    },

    setTomorrowData(item) {
        this._script = item.getComponent('TomorrowGift');
        this.tomorrowBtn = item;

        this.changeFlag();
        this.initView(this.tomorrowData.propList);

        this.tomorrowBtn.on('Refresh_Time', this.refreshTime, this);
        this.tomorrowBtn.on('change_Flag', this.changeFlag, this);
    },

    onDestroy() {
        this.tomorrowBtn.off('Refresh_Time', this.refreshTime, this);
        this.tomorrowBtn.off('change_Flag', this.changeFlag, this);
    },

    initView(data) {
        //初始化每个节点的数据
        for (var i = 0; i < data.length; i++) {
            var select = this.awardItem[i].getChildByName('select');
            var unSelect = this.awardItem[i].getChildByName('unSelect');
            var prop = ff.AccountManager.propsConfig.getPropById(data[i].propId);
            cc.log(prop);

            //图片
            unSelect.getChildByName('itemIcon').getComponent(cc.Sprite).spriteFrame = prop.spriteFrame;
            select.getChildByName('itemIcon').getComponent(cc.Sprite).spriteFrame = prop.spriteFrame;
            //名字
            unSelect.getChildByName('itemNameText').getComponent(cc.Label).string = data[i].description;
            select.getChildByName('itemNameText').getComponent(cc.Label).string = data[i].description;

            this.awardItem[i].rewardId = data[i].rewardId;
        }
    },

    judgeUserLoginDays(days) {
        days = days >= 3 ? 3 : days;
        for (var i = 1; i <= days; i++) {
            this.loginDays[i - 1].getChildByName('select').active = true;
            this.loginDays[i - 1].getChildByName('CompleteFlag').active = true;
        }
    },

    changeFlag() {
        //刷新数据
        this.tomorrowData = this._script.tomorrowData;
        this.judgeUserLoginDays(this.tomorrowData.days);
        this.showTicketOrCountDown(this._script.isCountDown);
    },

    showTicketOrCountDown(flag) {
        if (flag) {
            //抽奖按钮禁止
            this.drawBtn.interactable = false
            //抽奖券消失
            this.drawTicket.active = false;
            //倒计时显示
            this.countDown.node.active = true;
            //关闭动画
            this.drawAnim.stop('DrawBtnAnim');
            //初始化时间
            this.countDown.string = this._script.time;
        }
        else {
            //倒计时消失
            this.countDown.node.active = false
            //抽奖券显示
            this.drawTicket.active = true;
            //抽奖按钮可以使用
            this.drawBtn.interactable = true;
            //显示动画
            this.drawAnim.play('DrawBtnAnim');
            //抽奖劵数量为用户拥有数量
            this.drawTicketAmount.string = '.' + this._script.tickets + '/';
        }
    },

    refreshTime(event) {
        var time = event.detail;
        this.countDown.string = time;
    },

    cleanRewardAnim() {
        this.rewardAnim.parent = null;
    },

    startDraw() {
        if (this._startDraw || !this._endDraw) return;
        this._startDraw = true;
        this._endDraw = false;
        cc.Linker('GetTomorrowDraw').request(msgData => {
            this.cleanRewardAnim();
            this.rewardData = msgData;
            this._rewardId = msgData.rewardId;
            this._delayTime = 0.4;
            //剩余抽奖劵数量
            this.tickets = msgData.cards;
            //是否还有资格领取
            this._valid = msgData.valid;
            //刷新倒计时或者抽奖券
            this._script.updataTicket(this.tickets);

            this.awardItem[this._curPos].getChildByName('select').active = true;
            this.runDrawAction();
            this.node.runAction(cc.sequence(cc.delayTime(3.5), cc.callFunc(this.stopDraw, this)));
        }, () => {
            this._startDraw = false;
            this._endDraw = true;
        });
    },

    runDrawAction(index) {
        var isEnd = false;
        this.awardItem[this._curPos].getChildByName('select').active = false;
        this._curPos = this._curPos + 1 >= this.awardItem.length ? 0 : this._curPos + 1;
        this.awardItem[this._curPos].getChildByName('select').active = true;

        if (this._endDraw) {
            this._delayTime += 0.04;
            if (this._delayTime >= 0.35 && this._rewardId == this.awardItem[this._curPos].rewardId) {
                isEnd = true;

                this.rewardAnim.parent = this.awardItem[this._curPos];

                var showData = [];
                for (var i = 0; i < this.tomorrowData.propList.length; i++) {
                    if (this.tomorrowData.propList[i].rewardId == this._rewardId) {
                        showData.push({ propId: this.tomorrowData.propList[i].propId, propDesc: this.tomorrowData.propList[i].description })
                    }
                }
                ff.PopupManager.showAwardTips(showData, () => {
                    this._startDraw = false;
                    this._endDraw = true;
                    this._script.judgeShowTomorrow(this._valid);
                    if (!this._valid && this.tickets == 0) {
                        this.onClosePop();
                    }
                });
            }
        } else {
            this._delayTime -= 0.035;
        }

        this._delayTime < 0.02 && (this._delayTime = 0.02);

        if (!isEnd) {
            this.node.runAction(cc.sequence(cc.delayTime(this._delayTime), cc.callFunc(this.runDrawAction, this)));
        }
    },

    stopDraw() {
        this._endDraw = true;
    },

    onClosePop() {
        if (this._startDraw || !this._endDraw) return;
        this.node.emit('close');
    },
});
