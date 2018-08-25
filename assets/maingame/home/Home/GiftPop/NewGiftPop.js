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
        userName:cc.Label,
        useAmount:cc.Label,
        tipsLbl:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    initData:function(data){
        this.data = data;
        this.userName.string = data.fromUserNickname+"(id:"+data.fromUserId+")";
        this.useAmount.string = data.receiveAmount;
        this.tipsLbl.string = '本次领取已收取'+data.realTax*100+"%的手续费";
    },
    getGlodClick:function(){
        cc.Linker('ReceiveGold',{id:this.data.id}).request(data=>{
            this.node.emit('close');
            cc.Toast('接受成功').show();
            cc.Sound.playSound('getCoin');
            cc.log('dsadsadsa    '+this.data.receiveAmount);
            ff.AccountManager.coins += this.data.receiveAmount;
            ff.AccountManager.emit('EVENT_USERINFO_CHANGE');
        });
    },
    start () {

    },

    // update (dt) {},
});
