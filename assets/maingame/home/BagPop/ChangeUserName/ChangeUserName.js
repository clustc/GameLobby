cc.Class({
    extends: cc.Component,

    properties: {
        updateTimes:cc.Label,
        userName: cc.EditBox,
        mask: cc.Button,
    },

    start() {
        this.node.children[1].on('touchstart', event => event.stopPropagation(), this)
    },

    onEnable(){
        this.initUpdateNickName();
    },

    initUpdateNickName(){
        if(ff.AccountManager.updateNickName) this.updateTimes.string = '1';
        else this.updateTimes.string = '0';
    },

    onChangeUserName() {
        var username = this.userName.string;
        if (username == '') {
            cc.Toast('请输入昵称').show();
            return;
        }
        cc.Proxy('updateNickName', username).listen('RES_UPDATE_NICKNAME').called(event => {
            ff.AccountManager.updateNickName = false;
            ff.AccountManager.userName = username;
            cc.Toast('修改昵称成功').show();
            this.onClosePop();
        }, event => {
            cc.Toast('修改昵称失败').show();
         })

    },

    onClosePop() {
        this.node.children[1].runAction(cc.sequence(
            cc.scaleTo(0.2, 0.6, 0.6).easing(cc.easeExponentialIn()),
            cc.callFunc(() => {
                this.userName.string = '';
                this.mask.interactable = false;
                this.node.active = false;
            })
        ))
    },
});
