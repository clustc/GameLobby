cc.Class({
    extends: cc.Component,

    properties: {
        userText: cc.EditBox,
    },

    initData(data) {
        this.userInfo = data;
    },

    start(){
        this.node.children[0].on('touchstart',(event)=>event.stopPropagation(),this)
    },

    onLeaveMessage() {
        var signature = this.userText.string;

        if (ff.AccountManager.vipLevel < 2) {
            cc.Toast('只有达到VIP2等级及以上用户才能留言').show();
            return;
        }

        if (ff.AccountManager.jewels < 20) {
            cc.Toast('您的钻石不足，无法发送留言!').show();
            return;
        }

        if(signature == ''){
            cc.Toast('请输入留言信息！').show();
            return;
        }
        
        cc.Linker('SendEmail', { content: signature, target: this.userInfo.roleId }).request((data) => {
            cc.Toast('留言发送成功!').show();
            this.userText.string = '';
            // this.onClosePop();
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
