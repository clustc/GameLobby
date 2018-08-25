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
        timeLbl:cc.Label,
        nickName:cc.Label,
        userId:cc.Label,
        userAmount:cc.Label,
        statusLbl:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initData:function(data){
        this.timeLbl.string = data.createTime.split(' ')[0];
        this.nickName.string = data.fromUserNickname;
        this.userId.string = data.fromUserId;
        this.userAmount.string = data.receiveAmount;
        if (data.status == 1){
            this.statusLbl.string = '赠送中';
        }else if (data.status == 2){
            this.statusLbl.string = '已接受';
        }else{
            this.statusLbl.string = '赠送失败';
        }
    },
    initItemdata:function(data){
        this.timeLbl.string = data.createTime.split(' ')[0];
        this.nickName.string = data.toUserNickname;
        this.userId.string = data.toUserId;
        this.userAmount.string = data.giveAmount;
        if (data.status == 1){
            this.statusLbl.string = '赠送中';
        }else if (data.status == 2){
            this.statusLbl.string = '已接受';
        }else{
            this.statusLbl.string = '赠送失败';
        }
    },
    start () {

    },

    // update (dt) {},
});
