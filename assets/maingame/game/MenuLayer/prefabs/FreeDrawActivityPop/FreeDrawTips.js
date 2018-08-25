cc.Class({
    extends: cc.Component,

    properties: {
        lessGoldText: cc.Label,
        lessGold: cc.Label,
        lessGoldIcon: cc.Node,
    },

    initTips(data, msg, maxData) {
        if (msg.score >= maxData.score && msg.kill >= maxData.kill) {
            this.lessGoldText.string = '您的分数已满足钻石抽奖'
            this.lessGoldIcon.active = false;
            return;
        }else{
         
            if(msg.kill < data.kill){
                this.lessGoldText.string = '您距离' + data.desc + '仅差'  + (data.kill - msg.kill) + '条奖金鱼';
                this.lessGoldIcon.active = false;
                this.lessGold.string = '' ;
            }else{
                this.lessGoldText.string = '您距离' + data.desc + '仅差'
                this.lessGoldIcon.active = true;
                this.lessGold.string = data.score - msg.score ;
            }
        }
        
    },
    onConfirmDraw() {
        this.node.emit('close', true);
    }
});
