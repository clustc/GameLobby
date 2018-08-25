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
        scrollView: cc.Node,
        itemPrefab: cc.Prefab,
        activeTargetPrefab: cc.Prefab,
        spt_icon_frames: [cc.SpriteFrame],
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    onLoad() {
        this.pbComp = this.node.find('top/pb_active_value').getComponent(cc.ProgressBar);
        this.targetContainer = this.node.find('top/pb_active_value/node_target_container');

        this.isCanGetAll = false;

        this.UpdateView();
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    UpdateView() {
        this.UpdateBottom();
        this.UpdateTop();
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    UpdateBottom() {
        this.isCanGetAll = false;
        var data = ff.AccountManager.taskConfig.GetDataByTypeAndDateType(1, this.node.taskType);

        data.sort(function (a, b) {
            var sort_num = [2, 1, 1, 3];

            var log_a = ff.AccountManager.taskConfig.GetTaskLogById(a.taskId);
            var log_b = ff.AccountManager.taskConfig.GetTaskLogById(b.taskId);
            var status_a = log_a.taskStatus || 0;
            var status_b = log_b.taskStatus || 0;

            var num_a = sort_num[Number(status_a)];
            var num_b = sort_num[Number(status_b)];

            if (status_a != status_b) {
                return num_a - num_b;
            } else {
                return Number(a.seq) - Number(b.seq);
            }

        });

        var scrollComp = this.scrollView.getComponent(cc.ScrollView);
        scrollComp.content.removeAllChildren();

        if (!data) { return; }

        for (var i = 0; i < data.length; i++) {
            var single = data[i];
            var log = ff.AccountManager.taskConfig.GetTaskLogById(single.taskId);

            var item = cc.instantiate(this.itemPrefab);

            //任务icon

            // 1 金币 2 签到 3 抽奖 4 活动 5 分享 6 任意鱼 7 金鲨鱼 8银鲨鱼 9 章鱼海怪
            var spt_icon = item.find('node_frame/spt_icon').getComponent(cc.Sprite);
            var tmp_index = single.taskIcon ? Number(single.taskIcon) : 1;
            spt_icon.spriteFrame = this.spt_icon_frames[tmp_index - 1];

            //任务描述
            var lbl_des = item.find('node_frame/lbl_des').getComponent(cc.Label);
            lbl_des && (lbl_des.string = single.taskDesc);

            //奖励描述
            var txt = "";
            var props = single.propInfos;
            for (var j = 0; j < props.length; j++) {
                var prop = props[j];
                txt = txt + ff.AccountManager.propsConfig.getPropDescById(prop.propId)
                    + '×' + prop.propNum + (j < props.length - 1 ? '\n' : '');
            }
            var lbl_reward = item.find('node_frame/lbl_reward').getComponent(cc.Label);
            lbl_reward && (lbl_reward.string = txt);

            //任务进度
            var pb = item.find('node_frame/pb_single_task').getComponent(cc.ProgressBar);

            var progress = Math.min(log.progress || 0, single.taskCompletedCondition);
            pb.progress = progress / single.taskCompletedCondition;

            var lbl_pb = pb.node.getChildByName('lbl_pb').getComponent(cc.Label);
            lbl_pb && (lbl_pb.string = progress + ':' + single.taskCompletedCondition);

            //
            var spt_icon = item.find('node_frame/spt_icon').getComponent(cc.Sprite);
            single.awardIcon && spt_icon.loadImage(single.taskIcon);

            //
            var btn_go = item.find('node_frame/btn_go');
            btn_go.active = false;

            var btn_get = item.find('node_frame/btn_get');
            btn_get.active = false;

            var spt_tip_complete = item.find('node_frame/spt_tip_complete');
            spt_tip_complete.active = false;

            var status = log.taskStatus || 0;
            if (status === 1 || status === 0) {
                btn_go.active = true;

            } else if (status === 2) {
                btn_get.active = true;
                this.isCanGetAll = true;
            } else if (status === 3) {
                spt_tip_complete.active = true;
            }

            btn_go.on('click', this.OnBtnGoClicked, this);
            btn_go.data = single;

            btn_get.on('click', this.OnBtnGetClicked, this);
            btn_get.data = single;

            scrollComp.content.addChild(item);
        }

        this.node.parent.parent.getComponent('TaskView').ControlBtnShowGet(this.isCanGetAll);
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    UpdateTop(data, value) {
        var data = ff.AccountManager.taskConfig.GetDataByTypeAndDateType(3, this.node.taskType)
        var value = ff.AccountManager.taskConfig.GetVitalityByType(this.node.taskType);
        if (!data) { return; }

        //当前活跃值
        var lblCurActiveValue = this.node.find('top/spt_daily/lbl_cur_active_value').getComponent(cc.Label);
        lblCurActiveValue && (lblCurActiveValue.string = value);

        this.targetContainer.removeAllChildren(true);

        var length = data.length;
        var singleLength = this.pbComp.totalLength / length;
        var maxValue = 0;
        for (var i = 0; i < length; i++) {
            var single = data[i];
            var log = ff.AccountManager.taskConfig.GetTaskLogById(single.taskId);

            var target = cc.instantiate(this.activeTargetPrefab);
            target.x = singleLength * (i + 1);
            if (i === length - 1) {
                maxValue = single.taskCompletedCondition;
            }

            //活跃目标奖励图标
            var sptAwardIcon = target.find('node_award_tip/spt_award_icon').getComponent(cc.Sprite);
            sptAwardIcon && (sptAwardIcon.loadImage(single.awardIcon));

            //奖励
            var prop = single.propInfos[0];
            var lblAwardValue = target.find('node_award_tip/lbl_award_value').getComponent(cc.Label);
            lblAwardValue.string = prop.propNum;
            var sptAwardIcon = target.find('node_award_tip/spt_award_icon').getComponent(cc.Sprite);
            sptAwardIcon.spriteFrame = ff.AccountManager.propsConfig.getPropById(prop.propId).spriteFrame;

            //每个活跃目标
            var lblActiveValueComp = target.find('lbl_active_value').getComponent(cc.Label);
            lblActiveValueComp && (lblActiveValueComp.string = single.taskCompletedCondition);

            //领取奖励按钮
            var btnTarget = target.find('btn_target');
            btnTarget.scale = 1;
            btnTarget.active = false;
            btnTarget.taskId = single.taskId;
            btnTarget.on('click', this.OnBtnTargetClicked, this);
            btnTarget.stopAllActions()

            //可领取
            var spt_can_receive = target.find('spt_can_receive');
            spt_can_receive.scale = 1;
            spt_can_receive.active = false;
            spt_can_receive.stopAllActions();

            //已领取
            var spt_received = target.find('spt_received');
            spt_received.active = false;

            //动画
            var aniNode = target.getChildByName('node_ani');
            aniNode.active = false;
            aniNode.getComponent(cc.Animation).stop();

            var status = log.taskStatus || 0;
            if (status === 3) {
                //已领取
                btnTarget.active = true;
                spt_received.active = true;
                btnTarget.getComponent(cc.Button).interactable = false;

            } else {
                if (value >= single.taskCompletedCondition) {
                    //可领取
                    btnTarget.active = true;
                    btnTarget.getComponent(cc.Button).interactable = true;
                    btnTarget.runAction(cc.repeatForever(
                        cc.sequence(
                            cc.scaleTo(1.05, 1.1),
                            cc.scaleTo(1.05, 1),
                        )

                    ));

                    spt_can_receive.active = true;
                    spt_can_receive.runAction(cc.repeatForever(
                        cc.sequence(
                            cc.scaleTo(1.05, 1.1),
                            cc.scaleTo(1.05, 1),
                        )
                    ));

                    aniNode.active = true;
                    aniNode.getComponent(cc.Animation).play();
                }
            }

            this.targetContainer.addChild(target);
        }

        this.pbComp.progress = Math.min(value / maxValue, 1);
        this.pbComp.value = value;
        this.pbComp.maxValue = maxValue;
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    OnBtnGoClicked(event) {
        var btn = event.detail;
        var data = btn.node.data;
        var trigger = data.triggerAction;

        /**首页-任务-去完成 */
        ff.BuryingPoint(3401070001, {
            task_id: data.taskId,
            task_award: data.propInfos
        });

        switch (trigger) {
            case 1:
                cc.Popup('SignInPop').show();
                break;
            case 2:
            case 3:
            case 7:
                ff.GameManager.enterGameRoom(ff.AccountManager.roomConfig.defaultRoomId);
                break;
            default:
                break;
        }
        cc.systemEvent.emit('EvevtCloseTaskPop');
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    HttpGetAward(taksId, target, success, failure) {
        cc.Linker('GetTaskAward', { taskId: taksId }).request((msg) => {
            ff.AccountManager.taskConfig.refreshData(() => { this.UpdateView() });

            var data = ff.AccountManager.taskConfig.GetTaskInfoByTaskId(Number(msg.taskId));
            var param = [];
            for (let index = 0; index < data.propInfos.length; index++) {
                const element = data.propInfos[index];
                param.push({ propId: element.propId, propNumAdd: element.propNum });
            }
            ff.PopupManager.showAwardTips(param, () => {
                target.interactable = true;
            });
        }, (error, code) => {
            cc.Toast(tGetAwardErrorTip[code.toString()]).show();
            failure && failure();
            target.interactable = true;
        });
    },

    /*====================================================================================================
    /领取奖励
    /====================================================================================================*/
    OnBtnGetClicked(event) {
        var btn = event.detail;
        var data = btn.node.data;

        var param = {
            prop_id: data.propInfos[1].propId,
            task_id: data.taskId,
            return_amount: data.propInfos[1].propId == 2 ? data.propInfos[1].propNum : undefined,
            diamond_amount: data.propInfos[1].propId == 1 ? data.propInfos[1].propNum : undefined,
        }

        /**首页-任务-单任务领取 */
        ff.BuryingPoint(3401070002, param);

        btn.interactable = false;
        this.HttpGetAward(data.taskId, btn);
    },

    /*====================================================================================================
    /领取目标奖励
    /====================================================================================================*/
    OnBtnTargetClicked(event) {
        var btn = event.detail;
        var taskId = btn.node.taskId;

        btn.interactable = false;
        this.HttpGetAward(taskId, btn);
    },

    /*====================================================================================================
    /一键领取
    /====================================================================================================*/
    OnReceiveAll(success, failure) {
        /**首页-任务-一键领取 */
        ff.BuryingPoint(3401070003);
        var taskIdArray = [];
        var data = ff.AccountManager.taskConfig.GetDataByTypeAndDateType(1, this.node.taskType);
        for (var i = 0; i < data.length; i++) {
            var single = data[i];
            if (ff.AccountManager.taskConfig.GetTaskLogById(single.taskId).taskStatus === 2) {
                taskIdArray.push(single.taskId);
            }
        }

        if (taskIdArray.length === 0) {
            cc.Toast('当前暂无可领取任务奖励').show();
            return;
        }
        this.ReceiveRewardRecure(taskIdArray, success, failure);
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    ReceiveRewardRecure(array, success, failure) {
        var taskId = array.shift();
        cc.Linker('GetTaskAward', { taskId: taskId }).request((data) => {
            var data = data.result;
            if (array.length > 0) {
                this.ReceiveRewardRecure(array, success, failure);
            } else {
                cc.Toast('一键领取成功').show();
                ff.AccountManager.taskConfig.refreshData(() => {
                    this.UpdateView();
                    success && success();
                })
            }
        }, (error, code) => {
            cc.Toast(tGetAwardErrorTip[code.toString()]).show();
            ff.AccountManager.taskConfig.refreshData(() => {
                this.UpdateView();
                failure && failure();
            })
        });
    }

});
