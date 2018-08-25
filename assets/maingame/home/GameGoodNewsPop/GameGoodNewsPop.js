cc.Class({
    extends: cc.Component,

    properties: {
        contain: cc.Node,
        itemMsg: cc.Node,
        editMsg: cc.EditBox,
    },

    initItem(data) {
        this.isSend = false;
        this.data = data;
        this.contain.removeAllChildren();
        for (var i = 0; i < data.length; i++) {
            var item = cc.instantiate(this.itemMsg);
            item.getScript().initItem(data[i]);
            item.parent = this.contain;
        }
    },

    sendMessage() {
        if(this.isSend) {
            cc.Toast('请不要连续发送哦！').show();
            return;
        }

        if (ff.AccountManager.vipLevel < 2) {
            cc.Toast('只有达到VIP2等级及以上用户才能发送跑马灯').show();
            return;
        }

        if (ff.AccountManager._jewels < 10) {
            cc.Toast('您的钻石不足，无法发送跑马灯消息!').show();
            return;
        }
        if (this.editMsg.string == '') {
            cc.Toast('跑马灯消息不能为空!').show();
            return;
        }

        this.isSend = true;
        cc.Linker('SendHorseLamp', { content: this.editMsg.string }).request((data) => {
            this.isSend = false;
            cc.Toast('发送跑马灯消息成功!').show();
            var message = {
                content: this.editMsg.string,
                id: data.id,
                priority: 3,
                type: 3,
            }
            this.findPositionAndCreate(message);
            this.editMsg.string = '';
        },()=>{
            this.isSend = false;
        })
    },

    findPositionAndCreate(msg) {
        var _index;
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].priority === 3) {
                _index = i;
                break;
            }
        }
        var item = cc.instantiate(this.itemMsg);
        item.getScript().initItem(msg);
        this.contain.insertChild(item, _index);
    },
});
