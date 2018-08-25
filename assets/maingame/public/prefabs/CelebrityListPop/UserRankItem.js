cc.Class({
    extends: cc.Component,

    properties: {
        //排序的图片设置
        userRankingIcon:cc.Sprite,
        userRankingLevel:cc.Label,
        rankingIcon:[cc.SpriteFrame],

        //用户的图片设置
        userFrame:cc.Sprite,
        userIcon: cc.Sprite,
        userName: cc.Label,
        userGoldAmount: cc.Label,

        //弹窗
        leaveMessagePop: cc.Node,
        signaturePop:cc.Node,
    },

    initItem(data) {
        if(!data) return;
        this.itemData = data;
        if (data.index <= 3) {
            this.userRankingIcon.node.active = true;
            this.userRankingLevel.string = '';
            this.userRankingIcon.spriteFrame = this.rankingIcon[data.index - 1];
        }
        else {
            this.userRankingLevel.node.active = true;
            this.userRankingIcon.node.active = false;
            this.userRankingLevel.string = data.index;
        }

        this.userName.string = data.nickName;
        this.userGoldAmount.string = data.amount;
    },

    LoadImg(data){
        if(!data) return;
        ff.AccountManager.setUserHeadImage(data.headImg,this.userIcon);
    },

    //展示个性签名
    showSignature(node) {
        cc.Linker('GetUserSign', { sign: 0, userId: this.itemData.roleId }).request((data) => {
            this.signaturePop.getScript().initData(this.itemData);
            this.signaturePop.getScript().initItem(data);
            this.signaturePop.active = true
            this.signaturePop.children[1].scale = 0.6;
            this.signaturePop.children[1].runAction(cc.sequence(
               cc.scaleTo(0.3, 1).easing(cc.easeBackOut()),
                cc.callFunc(()=>{
                    this.signaturePop.children[0].getComponent(cc.Button).interactable = true;
                })
            ))
        });
    },

    onLeaveMessagePop() {
        //打开弹窗
        this.leaveMessagePop.active = true
        this.leaveMessagePop.children[1].scale = 0.6;
        this.leaveMessagePop.getScript().initData(this.itemData);
        this.leaveMessagePop.children[1].runAction(cc.scaleTo(0.3, 1).easing(cc.easeBackOut()));
    },

});
