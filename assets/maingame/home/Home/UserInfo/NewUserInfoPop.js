// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        headerFrame:cc.Sprite,
        nickName:cc.Label,
        userID:cc.Label,
        useAmount:cc.Label,
        fixUserName:cc.Button,
        bindPhone:cc.Button,
        accountNode:cc.Node,
        changeUserHead:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         cc.Linker('IsVisitorStatus').request(data=>this.refreshBindBtn(data));
        //  ff.AccountManager.on('FIXUSERNAMEFINISHED', this.refreshUserInfo, this);  
         ff.AccountManager.on('EVENT_USERINFO_CHANGE', this.setUserInfo, this)
     },
     refreshBindBtn:function(data){
        this.leafs = data.leafs;
        if (!data.status){
            this.bindPhone.node.active = false;
        }else{
           this.bindPhone.node.active = true;
        }
     },
     //设置用户名 头像，金币
     setUserInfo:function(){
        var data = ff.AccountManager;
        ff.AccountManager.setUserHeadImage(data.userHead,this.headerFrame);
        this.nickName.string = data.userName;
        this.useAmount.string = data.coins;
        if (data.nicknameFlag){
            this.fixUserName.node.active = true;
        }else{
            this.fixUserName.node.active = false;
        }
     },
     refreshUserInfo:function(){
        cc.Linker('UicPersonalInfo').request(data=>this.initData(data));
        cc.Linker('IsVisitorStatus').request(data=>this.refreshBindBtn(data));
     },
    initData:function (data) {
        ff.AccountManager.setUserHeadImage(data.headImg, this.headerFrame);
        this.nickName.string = data.nickname;
        this.userID.string = data.userId;
        this.useAmount.string = data.useAmount;
        if (data.nicknameFlag){
            this.fixUserName.node.active = true;
        }else{
            this.fixUserName.node.active = false;
        }

    },
    fixUserNameClick:function(){
        cc.Popup('NewFixNamePop').outsideClose(false).show();
    },
    
    changeHeadFrame:function(){
        cc.Popup('ChangeHead').outsideClose(false).show();
    },
    bindPhoneAction:function(){
        cc.Popup('NewBindPhonePop').outsideClose(false).show((node)=>{node.initData(this.leafs)});
    },
    toggleAccount:function(){
        this.accountNode.active = true;
    },
    confirmQuitAccount:function(){
        this.node.emit('close');
        // cc.sys.localStorage.removeItem('refreshToken');
        // require('CCGlobal').accessToken = '';
        // cc.director.loadScene('LoginScene');
        cc.Proxy('exit').called();
    },
    cancelQuitAccount:function(){
        this.accountNode.active = false;
    },  
    start () {

    },

    // update (dt) {},
});
