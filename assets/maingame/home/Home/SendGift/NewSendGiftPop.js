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
        receiveIdEdit:cc.EditBox,
        sendMoneyEdit:cc.EditBox,
        tip1Lbl:cc.Label,
        tip2Lbl:cc.Label,
        sendBtn:cc.Button
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        cc.Linker('SendGifConfig').request(data=>{
            cc.log('SendGifConfig   '+JSON.stringify(data));
            if (data.agentId != null){
                self.receiveIdEdit.string = data.agentId;
            }
            self.tip1Lbl.string = '单次赠送金额不小于'+data.minLimit/10000+'万';
            self.tip2Lbl.string = '系统收取接收方赠送金额的'+data.tax*100+"%作为手续费";
        });
    },
    onEditBoxChanged:function(){
        // if (this.receiveIdEdit.string.length > 0 && this.sendMoneyEdit.string.length > 0){
        //     this.sendBtn.interactable = true;
        // }else{
        //     this.sendBtn.interactable = false;
        // }
    },
    sendBtnAction:function(){
        
        var leaf_nums = this.sendMoneyEdit.string;
        var userid = this.receiveIdEdit.string;
        if (userid.length === 0) {
            cc.Toast('请填写接受玩家ID').show();
            return false;
        }
        if (leaf_nums.length === 0) {
            cc.Toast('请填写赠送金额').show();
            return false;
        }
        this.sendBtn.interactable = false;
        cc.log('click');
        cc.Linker('SendGift',{amount:parseFloat(leaf_nums)*10000,userId:userid}).showLoading(true).request(data=>{
            this.node.emit('close');
            cc.Toast("赠送成功").show();
            // this.sendBtn.interactable = true;
            cc.Sound.playSound('sendCoin');
            ff.AccountManager.emit('EVENT_REFRESH_GOLDAMOUNT');
        },(msg,code)=>{
            this.sendBtn.interactable = true;
        });
    },
    start () {

    },

    // update (dt) {},
});
