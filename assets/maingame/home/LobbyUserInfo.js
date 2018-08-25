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
        nickNameLbl:cc.Label,
        userIdLbl:cc.Label,
        userAmountLbl:cc.Label,
        headerFrame:cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.node.on('click',this.fixUserHeadImg,this);
        this.node.on('end_load_persist_node', ()=>{
            ff.AccountManager.on('EVENT_USERINFO_CHANGE', this.setUserInfo, this);
            ff.AccountManager.on('EVENT_COINS_CHANGE', this.setUserInfo, this);
        }, this);
    },

    fixUserHeadImg:function(){
        cc.Popup('NewUserInfoPop').outsideClose(false).show((node)=>{node.initData(this.data)});
    },

    setUserInfo:function(){
        var data = ff.AccountManager;
        if (data.userHead){
            ff.AccountManager.setUserHeadImage(data.userHead, this.headerFrame);
        }
        this.nickNameLbl.string = data.userName;
        this.data.headImg = data.userHead;
        this.userAmountLbl.string = data.coins;
    },
    
    initData:function(data){
        this.data = data;
        cc.log('setUserInfo   '+JSON.stringify(data));
        let headStr = this.data.headImg;
        let value = 0;
        if (headStr != null) {
            let startPos = headStr.lastIndexOf('_') + 1;
            let endPos = headStr.lastIndexOf('.png');
            cc.log('startPos ' + startPos + ' endPos ' + endPos + ' result ' + headStr.substr(startPos, endPos - startPos));
            let totalNum = endPos - startPos;
            let subNum = headStr.substr(startPos, totalNum);
            value = Number(subNum) - 1;
        }
        // here can't do it.
        //this.data.headImg = ''+ value;
        cc.log('this.data.headImg ', ''+ value);
        ff.AccountManager.userName = data.nickname || data.loginname;
        ff.AccountManager.userId = data.userId;
        ff.AccountManager.nicknameFlag = data.nicknameFlag;
        this.nickNameLbl.string = data.nickname;
        this.userIdLbl.string = data.userId;
        this.userAmountLbl.string = data.useAmount;
        ff.AccountManager.coins = data.useAmount;
        ff.AccountManager.setUserHeadImage(''+ value, this.headerFrame);
        ff.AccountManager.userHead = ''+ value;
    },
    copyID:function(){
        cc.Toast('复制成功').show();
        cc.Proxy('copyText', String(ff.AccountManager.userId)).called();
    },
    start () {

    },

    // update (dt) {},
});
