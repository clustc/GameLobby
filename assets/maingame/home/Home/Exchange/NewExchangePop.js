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
        exchangeCode:cc.EditBox,
        exchangeBtn:cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    exchangeAction:function(){
        var code = this.exchangeCode.string;
        if (!code){
            cc.Toast('请输入兑换码').show();
            return;
        }
        this.exchangeBtn.interactable = false;
        cc.Linker('ExchangeCode',{code:code}).showLoading(true).request(data=>{
            cc.Toast("恭喜您成功兑换了" + data + "金叶子").show();
            ff.AccountManager.coins += parseInt(data);
            // ff.AccountManager.emit('EVENT_COINS_CHANGE');
            this.node.emit('close');
            this.exchangeBtn.interactable = true;
        },(msg,err)=>{
            this.exchangeBtn.interactable = true;
        });
    },
    start () {

    },

    // update (dt) {},
});
