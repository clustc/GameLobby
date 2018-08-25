cc.Class({
    extends: cc.Component,

    properties: {
        mailButton: cc.Node,
    },

    //====================================================================================================
    //** */
    //====================================================================================================
    onLoad() {
        this.redPoint = this.node.getComponent('PrefabAttach');
        this.redPoint.Reg('SettingButton', this.node.find('MailButton'));
        cc.systemEvent.on('ON_BEAT_HTTP_RECEIVED', this.DoHeartBeatMsg, this);
        this.setIsOpen();
    },

    //====================================================================================================
    //** 入口显示*/
    //====================================================================================================
    setIsOpen() {
        // var data = ff.AccountManager.switchConfig.data;
        // this.mailButton.active = data[21].state;
    },

    //====================================================================================================
    //** 打开设置弹窗*/
    //====================================================================================================
    onOpenSetting() {
        /**首页-设置 */
        // ff.BuryingPoint(3401140001);
        // cc.Popup('HomeSettingPop').show((item) => {
        //     item.initData(this.node.parent.getScript().isShowHorseLamp);
        // }, (data) => {
        //     if (data == undefined) return;
        //     this.node.parent.getScript().setHorseLamp(data);
        // });
        cc.director.loadScene('GameLobbyScene');
    },

    //====================================================================================================
    //** */
    //====================================================================================================
    OnMailBtnClicked() {
        /**首页-邮件 */
        ff.BuryingPoint(3401130001);
        cc.Popup('MailViewPop').show();
    },

    //====================================================================================================
    //** */
    //====================================================================================================
    DoHeartBeatMsg(event) {
        var newMailTypes = event.detail.newMailTypes;
        if ((newMailTypes instanceof Array) && newMailTypes.length > 0) {
            this.node.emitEvent('SettingButton', {
                action: 'attach',
                align: 'TopRight',
            })
        }
        else if ((newMailTypes instanceof Array) && newMailTypes.length === 0) {
            this.node.emitEvent('SettingButton', {
                action: 'detach',
            })
        }
    }
});
