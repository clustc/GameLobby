cc.Class({
    extends: cc.Component,

    properties: {
        userHeadFrame:cc.Sprite,
        maskBtn:cc.Button,
        userHead: cc.Sprite,
        userNickname: cc.Label,
        userSignature: cc.Label,
    },

    onEnable() {
        cc.Linker('').request((data) => {

        });
    },

    initData(data) {
        this.userInfo = data;
    },

    start() {
        // this.node.children[1].on('touchstart', (event) => event.stopPropagation(), this)
    },

    initItem(data) {
        ff.AccountManager.setUserHeadImage(this.userInfo.headImg, this.userHead);
        this.userNickname.string = this.userInfo.nickName;
        this.userSignature.string = data.message == null ? '该用户很懒，暂时没有个性签名哦~' : data.message;
    },

    onClosePop() {
        this.node.children[1].runAction(cc.sequence(
            cc.scaleTo(0.2, 0.6, 0.6).easing(cc.easeExponentialIn()),
            cc.callFunc(() => {
                this.maskBtn.interactable = false;
                this.node.active = false;
            })
        ))
    },
});
