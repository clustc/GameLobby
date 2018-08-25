cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.isClick = false;
    },

    onAccountPhoneBind() {
        /*首页-绑定账号-手机绑定*/
        ff.BuryingPoint(3401050003);
        this.node.emit('close');
        cc.Popup('PhoneRegisterPop').show();
    },

    onWechatBind() {
        /*首页-绑定账号-微信绑定*/
        ff.BuryingPoint(3401050001);
        cc.Proxy('bindToWX').listen('RES_WX_BIND').called(event => {
            this.isBindSussess(event.detail);
            this.node.emit('close');
        }, (event) => {
            cc.Toast('微信绑定失败，请重试!').show();
        });
    },

    onQQBind() {
        /*首页-绑定账号-QQ绑定*/
        ff.BuryingPoint(3401050002);
        cc.Proxy('bindToQQ').listen('RES_QQ_BIND').called(event => {
            this.isBindSussess(event.detail);
            this.node.emit('close');
        }, (event) => {
            cc.Toast('QQ绑定失败，请重试!').show();
        });
    },

    isBindSussess(data) {
        if (data.accessToken) {
            var showData = [{ propId: 1, propNumAdd: 20 }];
            ff.PopupManager.showAwardTips(showData, () => {
                cc.Toast('绑定成功').show();
                ff.AccountManager.onGetToken(data, null, 'isLoading');
            });
        } else {
            cc.Toast('此账号已绑定其他用户').show();
        }
    },

});
