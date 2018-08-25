const tGetAwardErrorTip = {
    '26': '尚未满足领取条件',
    '27': '奖励已经领取',
    '28': '当前任务不存在',
    '29': '当前活跃值不足',
    '30': '奖励发放失败，稍后再试，或联系客服',
};

cc.Class({
    extends: cc.Component,

    properties: {
        targetPrefab: cc.Prefab,
        awardPrefab: cc.Prefab,
        node_anim: cc.Node,
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    onLoad() {
        this.node.active = false;
        this.taskNewbieData = null;
        var state = ff.AccountManager.switchConfig.findStateByName('newbieTask');
        if (!state) return;

        this.nodeTarget = this.node.getChildByName('node_target');
        this.nodeReward = this.node.getChildByName('node_reward');
        this.sptTarget = this.node.getChildByName('spt_target');
        this.sptReceive = this.node.getChildByName('spt_receive');

        cc.Linker('GetNewbieTask').request((data) => {
            this.OnBeatHttpReceived(data);
        });
        ff.WSLinkManager.on('taskNewBieMsg', this.onTaskNewbieMsg, this);
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    onMoveAnim(direction, cbk) {
        var pos, time;
        if (direction == 'down') {
            time = 0.6;
            pos = cc.p(0, 375);
        } else {
            time = 0.3;
            pos = cc.p(0, 515);
        }

        this.node.runAction(
            cc.sequence(
                cc.moveTo(time, pos).easing(cc.easeElasticOut(3.0)),
                cc.callFunc(() => {
                    cbk && cbk();
                })
            )
        )

    },
    /*====================================================================================================
    /
    /====================================================================================================*/
    OnClicked(event) {
        var btn = event.target.getComponent(cc.Button);
        var config = ff.AccountManager.taskConfig.GetNewbieTaskById(this._taskId);
        btn.interactable = false;
        if (this._taskId) {
            cc.Linker('GetTaskAward', { taskId: this._taskId }).request((data) => {
                var item_config = {};
                item_config.item_id = config.propInfos[0].propId;
                item_config.item_num = config.propInfos[0].propNum;
                cc.systemEvent.emit('EvevtFlyItemToMyPos', item_config);
                ff.BuryingPoint(3402000019, {
                    task_id: this._taskId,
                    betting_amount: 0,
                });

                this.onMoveAnim('up', () => {
                    this.OnBeatHttpReceived(data.taskResponse);
                })
            }, (error, code) => {
                cc.Toast(tGetAwardErrorTip[code.toString()]).show();
                btn.interactable = true;
            });
        }
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    OnBeatHttpReceived(data) {
        var newbie = data;
        this.taskNewbieData = data;
        if (!newbie) {
            this.node.active = false;
        } else {
            this.node.active = true;
            var showRecieve = (newbie.taskStatus === 2);
            this.onMoveAnim('down', () => {
                this.node.getComponent(cc.Button).interactable = showRecieve;
            });

            this.node_anim.active = showRecieve;
            this.sptReceive.active = showRecieve;

            this.sptTarget.active = !showRecieve;
            this.nodeTarget.active = !showRecieve;

            if (this._taskId !== newbie.taskId) {
                this._taskId = newbie.taskId;
                this.AddNewTaskInfo(newbie);
            } else {
                var progress = Math.min(newbie.progress, newbie.taskCompletedCondition) + '/' + newbie.taskCompletedCondition;
                var target = this.nodeTarget.getChildByName('prefab_target');
                target && (target.getChildByName('lbl_progress').getComponent(cc.Label).string = progress);
            }
        }

    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    onTaskNewbieMsg(event) {
        if (!this.taskNewbieData) return;
        var newbie = event.detail;
        cc.log(newbie);
        if (this._taskId == newbie.taskId) {
            var progress = Math.min(newbie.propress, this.taskNewbieData.taskCompletedCondition) + '/' + this.taskNewbieData.taskCompletedCondition;
            var target = this.nodeTarget.getChildByName('prefab_target');
            target && (target.getChildByName('lbl_progress').getComponent(cc.Label).string = progress);
            if (newbie.taskStatus == 2) {
                this.node_anim.active = true;
                this.sptReceive.active = true;
                this.sptTarget.active = false;
                this.nodeTarget.active = false;
                this.node.getComponent(cc.Button).interactable = true;
            }
        }
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    AddNewTaskInfo(data) {
        this.ResetPanel();
        this.AddTargetDesc(data.taskDesc, Math.min(data.progress, data.taskCompletedCondition) + '/' + data.taskCompletedCondition);
        this.AddAwardDesc(data.propInfos);
        ff.BuryingPoint(3402000009, {
            task_id: this._taskId,
            betting_amount: 0,
        });
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    ResetPanel() {
        this.nodeTarget.removeAllChildren();
        this.nodeReward.removeAllChildren();
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    AddTargetDesc(desc, progress) {
        let target = cc.instantiate(this.targetPrefab);
        target.name = 'prefab_target';

        let lblDescComp = target.getChildByName('lbl_des').getComponent(cc.Label);
        let lblProgressComp = target.getChildByName('lbl_progress').getComponent(cc.Label)

        lblDescComp.string = desc;
        lblProgressComp.string = progress;

        this.nodeTarget.addChild(target);
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    AddAwardDesc(data) {
        for (var i in data) {
            var single = data[i];
            let award = cc.instantiate(this.awardPrefab);
            let sptComp = award.getChildByName('spt_award').getComponent(cc.Sprite);
            let lblComp = award.getChildByName('lbl_num').getComponent(cc.Label)
            let spt_yuan = award.getChildByName('spt_yuan');

            sptComp.spriteFrame = ff.AccountManager.propsConfig.getPropById(single.propId).spriteFrame;
            var propNum = single.propId === 3 ? String(single.propNum / 10).replace('.', ':') : single.propNum;
            lblComp.string = propNum;
            spt_yuan.active = single.propId === 3;

            this.nodeReward.addChild(award);
            sptComp.node.height = sptComp.node.height * 0.4;
            sptComp.node.width = sptComp.node.width * 0.4;
        }
    },

});
