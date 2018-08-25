cc.Class({
    extends: cc.Component,

    properties: {
        headList: cc.Node,
        mask: cc.Button,
    },

    onLoad() {
        this.defaultNum = null;
        this._radioButton = this.node.getComponent('RadioButton');
        this.setTagToNode();
        this.node.on('click_start', this.onClickStart, this);
        // 
        this.headData = [17,18,19,20,21,22,23,24,25,26,27,28,29];
        // var self = this;
        // cc.Linker('DefaultHeaderFrame').showLoading(true).request(data=>{
        //       cc.log('DefaultHeaderFrame    '+data);
        //       for (var i = 0; i< data.length;i++) {
        //           cc.log('data ', data[i]);
        //       }
        //       this.headData = data;
        //       //this.init();
        // });
        
        
    },

    start(){
        this.node.children[1].on('touchstart', event => event.stopPropagation(), this)
        this.init();
        this._radioButton.setButtonSpriteFrame();
    },

    onDestroy() {
        this.node.off('click_start', this.onClickStart, this);
    },

    setTagToNode() {
        for (var i = 0; i < this._radioButton.buttonArray.length; i++) {
            this._radioButton.buttonArray[i].node.order = i;
        }
    },

    init() {
        var type = ff.AccountManager.setUserHeadImage(ff.AccountManager.userHead);
        this._radioButton.setState(type);
    },

    onClickStart(event) {
        this.defultHeadID = this.headData[event.detail.node.order];
        cc.log('dsdsad   '+event.detail.node.order);
        cc.log('dsdsad23123213   '+this.defultHeadID);
        this.defaultNum = event.detail.node.order;
    },

    onChangeHeadImage() {
        if (this.defaultNum <= 12) {
            cc.Linker('EditDefaultHeaderFrame',{id:this.defultHeadID}).request(data=>{
                cc.Toast('修改头像成功').show();
                ff.AccountManager.userHead = this.defaultNum+'';
                this.node.emit("close");
            });
            // cc.Proxy('updateLocalAvatar', String(this.defaultNum)).listen('RES_UPDATE_LOCAL_AVATAR').called(event => {
            //     ff.AccountManager.userHead = event.detail.msg;
            //     cc.Toast('修改头像成功').show();
            //     this.onClosePop();
            // }, event => {
            //     cc.Toast('修改头像失败').show();
            // });
        } else {
            cc.Proxy('updateAvatar').listen('RES_UPDATE_AVATAR').called(event => {
                ff.AccountManager.userHead = event.detail.msg;
                // ff.AccountManager.emit('FIXUSERNAMEFINISHED');
                cc.Toast('修改头像成功').show();
                this.node.emit("close");
            }, event => {
                cc.Toast('修改头像失败').show();
            });
        }
    },

    onClosePop() {
        this.node.children[1].runAction(cc.sequence(
            cc.scaleTo(0.2, 0.6, 0.6).easing(cc.easeExponentialIn()),
            cc.callFunc(() => {
                this.mask.interactable = false;
                this.node.active = false;
            })
        ))
    },
});
