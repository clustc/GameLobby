const END_POSITIONX = 5;
cc.Class({
    extends: cc.Component,

    properties: {
        playerFrame:cc.Sprite,
        playerIcon: cc.Sprite,
        userNickName: cc.Label,
        userLevel: cc.Label,
        userLevelProgressBar: cc.Node,

        userId: cc.Label,
        userVipLevel: cc.Label,

        //绑定账号按钮
        bindAccountBtn: cc.Node,
        //复制提示
        copyTipsBtn: cc.Button,
        copyTips: cc.Node,
        //修改用户头像
        changeUserHeadBtn: cc.Button,
        changeUserHead: cc.Node,
        //修改用户昵称
        changeUserNameBtn: cc.Button,
        changeUserName: cc.Node,
    },

    onLoad() {
        //END_POSITIONX终点时X位置 this.userLevelProgressBar.x为初始位置，一定要置为0%的状态
        this.PROGRESS_WIDTH = END_POSITIONX - this.userLevelProgressBar.x;
        ff.AccountManager.on('EVENT_USERINFO_CHANGE', this.setUserInfo, this);
        ff.AccountManager.on('EVENT_REFRESH_ACCOUNT', this.setUserInfo, this);
        this.setUserInfo();

        this.isOpenData = ff.AccountManager.switchConfig.data;
        // this.changeUserNameBtn.node.active =  this.isOpenData[8].state;
    },

    onDestroy() {
        ff.AccountManager.off('EVENT_USERINFO_CHANGE', this.setUserInfo, this);
        ff.AccountManager.off('EVENT_REFRESH_ACCOUNT', this.setUserInfo, this);
    },

    setUserInfo() {
        var data = ff.AccountManager;
        this.userInfo = data;
        cc.log('fish userInfo  '+data.userHead);
        ff.AccountManager.setUserHeadFrame(this.playerFrame);
        ff.AccountManager.setUserHeadImage(data.userHead, this.playerIcon);
        this.userNickName.string = data.userName;
        this.userLevel.string = data.playerLevel;
        this.userId.string = String(data.userId);
        this.userVipLevel.string = data.vipLevel ? data.vipLevel : 0;
        // this.bindAccountBtn.active = data.isVisitor;
        this.setUserLevelProgress(data.playerExps, data.upgradeExps);
    },

    setUserLevelProgress(exp, upgradeExp) {
        this.userLevelProgressBar.x = (1 - (exp / upgradeExp)) * (-this.PROGRESS_WIDTH);
    },

    onShowCopyTips() {
        cc.Toast('复制成功').show();
        cc.Proxy('copyText', String(this.userInfo.userId)).called();
    },

    onChangeHead() {
        // this.openChangePop(this.changeUserHead, true);
    },

    onChangeUserName() {
        this.openChangePop(this.changeUserName);
    },

    openChangePop(node, flag) {
        node.active = true
        node.children[1].scale = 0.6;
        var action;
        if (flag) {
            action = cc.sequence(
                cc.scaleTo(0.3, 1).easing(cc.easeBackOut()),
                cc.callFunc(() => {
                    node.children[0].getComponent(cc.Button).interactable = true;
                })
            )
        } else {
            action = cc.scaleTo(0.3, 1).easing(cc.easeBackOut());
        }
        node.children[1].runAction(action);
    },

    onVipPriliegePop() {
        this.node.parent.emit('close');
        cc.Popup('VipPrivilegePop').show();
    },

    onOpenAccoundBindPop() {
        this.node.parent.emit('close');
        cc.Popup('AccountBindPop').show();
    },
});
