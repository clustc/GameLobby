cc.Class({
    extends: cc.Component,

    properties: {
        userText: cc.EditBox,
    },

    start(){
        this.node.children[0].on('touchstart',(event)=>event.stopPropagation(),this)
    },

    onSignature(data) {
        var signature = this.userText.string;
        
        if(signature == ''){
            cc.Toast('请输入留言信息！').show();
            return;
        }

        cc.Linker('EditUserSign', { sign: signature, userId: ff.AccountManager.userId }).request((data) => {
            this.userText.string = '';
            this.onClosePop();
            cc.Toast('修改个性签名成功').show();
        });
    },

    onClosePop() {
        this.node.children[1].runAction(cc.sequence(
            cc.scaleTo(0.2, 0.6, 0.6).easing(cc.easeExponentialIn()),
            cc.callFunc(() => {
                this.userText.string = '';
                this.node.active = false;
            })
        ))
    },
});
