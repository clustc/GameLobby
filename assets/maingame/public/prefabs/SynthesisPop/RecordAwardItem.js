cc.Class({
    extends: cc.Component,

    properties: {
        parentNode: cc.Node,
        awardDay: cc.Label,
        awardTime: cc.Label,
        awardName: cc.Label,
        awardFlag: cc.Node,
    },

    init(data) {
        if (!data) return;
        this.itemData = data;
        var str = data.createTime.split(' ');
        this.awardDay.string = str[0];
        this.awardTime.string = str[1];
        this.awardName.string = data.awardsName;
        this.awardFlag.children.forEach((item) => {
            item.active = false;
        })
        if (data.receiveStatus <= 2) {
            this.awardFlag.children[data.receiveStatus - 1].active = true;
        } else {
            var index = (data.awardsType == 3) ? 2 : 3;
            this.awardFlag.children[index].active = true;
        }
    },

    onReceive() {
        /**首页-兑换页面-奖励领取*/
        ff.BuryingPoint(3401060004, {
            recharge_id: this.itemData.id
        });
        cc.Popup('ChangeUserAddr').show(null, (isSuccess) => {
            isSuccess = isSuccess == 'true';
            if (isSuccess) {
                ff.BuryingPoint(3401060005);
                cc.Linker('GetReceiveAward', { activityId: this.itemData.activityId, id: this.itemData.id }).showMessage(false).request((data) => {
                    if (data.isSuccess) {
                        this.parentNode.emit('Refresh_List', 1.3);
                        cc.Toast('领取成功').show();
                    } else {
                        cc.Toast('领取失败').show();
                    }
                }, (error, code) => {
                    if (code === 101) {
                        cc.Toast('请不要重复操作').show();
                    }
                })
            }
        });
    },

    onCheckData() {
        ff.PopupManager.showDialogPop(this.itemData.receiveRemark, () => {
            this.node.emit('close');
        })
    },
});

