cc.Class({
    extends: require('PoolLayer'),

    properties: {
        monthContent: cc.Node,
        commonContent: cc.Node,

        selectFrame: [cc.SpriteFrame],
        unSelectFrame: [cc.SpriteFrame],

        //进度条设置
        progress: cc.ProgressBar,
        nextVipLevel: cc.Label,
        rechargeTips: cc.RichText,

        monthItem: cc.Prefab,
        commonItem: cc.Prefab,
    },

    onLoad() {
        this.arrData = [];
        this._radioButton = this.node.getComponent('RadioButton')

        this.setTag();

        ff.AccountManager.on('EVENT_REFRESH_ACCOUNT', this.setUserProgress, this);
        this.node.on('click_start', this.setShopViewShow, this);
        this.node.on('click_cancel', this.clickCancel, this);
        this.setUserProgress();
    },

    onDestroy() {
        ff.AccountManager.off('EVENT_REFRESH_ACCOUNT', this.setUserProgress, this);
        this.node.off('click_start', this.setShopViewShow, this);
        this.node.off('click_cancel', this.clickCancel, this);
    },

    init(flag) {
        var index = flag;
        this.setFirstSate(index);
        // ff.AccountManager.shopConfig.refreshShopData((data) => {
        //     this.shopData = data;
        //     this.setFirstSate(index);
        // }, 'isLoading')
    },

    setTag() {
        for (var i = 0; i < this._radioButton.buttonArray.length; i++) {
            this._radioButton.buttonArray[i].node.order = i;
        }
    },

    clickCancel(event) {
        var item = event.detail.node;
        item.getComponent(cc.Sprite).spriteFrame = this.unSelectFrame[item.order];
    },

    setFirstSate(flag) {
        if (flag) this._radioButton.setState(flag);
        else this._radioButton.setState(0);
        this.setUserProgress();
    },

    setShopViewShow(event) {
        var item = event.detail.node;
        item.getComponent(cc.Sprite).spriteFrame = this.selectFrame[item.order];
        if (!this.shopData) return;
        if (this.monthContent.children.length === 0) {
            this.createMonthContent();
        }
        this.refreshCommonContent(item.order);
    },


    createObject(type) {
        var object = null;
        if (type === 'month') {
            object = cc.instantiate(this.monthItem);
        } else if (type === 'common') {
            object = cc.instantiate(this.commonItem);
        }
        return object;
    },

    resetObject(object, type) {
        object.parent = null;
    },

    createMonthContent() {
        for (var i = 0; i < this.shopData.month.length; i++) {
            var node = this.produce('month');
            node.getScript().init(this.shopData.month[i]);
            node.parent = this.monthContent;
        }
    },

    createCommonItem(data) {
        var node = this.produce('common');
        node.getScript().init(data);
        node.parent = this.commonContent;
    },

    refreshCommonContent(index) {
        var name = index === 0 ? 'gold' : 'daimand';
        var configList = this.shopData[name];
        var commonflag = this.judgeData(index, configList);
        if (commonflag) {
            this.refreshMoreCommonContent(index, configList);
        }
        else {
            this.refreshLessCommonContent(index, configList);
        }
    },

    refreshMoreCommonContent(index, configList) {
        for (var i = 0; i < configList.length; i++) {
            if (this.commonContent.children[i]) {
                this.commonContent.children[i].getScript().init(configList[i]);
            }
            else {
                this.createCommonItem(configList[i]);
            }
        }
    },

    refreshLessCommonContent(index, configList) {
        for (var i = 0; i < this.commonContent.children.length; i++) {
            if (configList[i]) {
                this.commonContent.children[i].getScript().init(configList[i]);
            }
            else {
                this.reclaim(this.commonContent.children[i], 'common');
                i--;
            }
        }
    },

    judgeData(index, configList) {
        if (configList.length > this.commonContent.children.length) {
            return true;
        }
        else {
            return false;
        }
    },

    setUserProgress() {
        // var vipConfigData = ff.AccountManager.vipConfig.data;
        // var nowVipLevel = ff.AccountManager._vipLevel;
        // if (nowVipLevel >= vipConfigData.length) {
        //     this.nextVipLevel.string = vipConfigData.length;
        //     this.rechargeTips.string = '<b>您已达到最高VIP等级</b>';
        //     var progress = 1;
        // }
        // else {
        //     this.nextVipLevel.string = nowVipLevel + 1;
        //     var lastRecharge = vipConfigData[nowVipLevel].recharge - ff.AccountManager.recharge;
        //     this.rechargeTips.string = '<b>再充值<color=red>' + lastRecharge + '元</color>,即可升级到</b>';
        //     var progress = ff.AccountManager.recharge / vipConfigData[nowVipLevel].recharge;
        // }

        // this.progress.progress = progress;
    },

    onVipPrivilege() {
        ff.BuryingPoint(3401020005);
        this.node.emit('close');
        cc.Popup('VipPrivilegePop').show();
    },

    onBtnClickGold() {
        ff.BuryingPoint(3401020003);
    },

    onBtnClickDimon() {
        ff.BuryingPoint(3401020004);
    },
});
