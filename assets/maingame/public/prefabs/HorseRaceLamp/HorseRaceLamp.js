cc.Class({
    extends: cc.Component,

    properties: {
        horseLampMsg: cc.RichText,
        interval: 0,
    },

    onLoad() {
        //当前显示的位置
        this.index = -1;
        //任务ID
        this.taskId = 0;
        //循环次数
        this.times = 0;
        //显示的队列
        this.arrList = null;
        //是否是移动状态
        this.isMoving = false;
        //是否已经有定时器
        this.isSchedule = false;
        //是否当前的数据已经全部跑完
        this.isRunFinish = true;
        //是否展示跑马灯
        this.isShowHorseLamp = ff.GameManager.getItem('isHorseLamp') === 'false' ? false : true;
        this.isHorseState = ff.AccountManager.switchConfig.findStateByName('horseRaceLamp');
        this.node.active = false;
        this.getHorseLampMsg();

        cc.systemEvent.on('ON_BEAT_HTTP_RECEIVED', this.DoHeartBeatMsg, this);
        ff.AccountManager.on('Change_HorseLamp', this.setHorseLamp, this);
    },

    start(){
        var scene = cc.director.currentScene;
        if(scene === 'GameScene'){
            this.node.getComponent(cc.Widget).top = 130;
            this.node.getComponent(cc.Button).interactable = false;
        }else{
            this.node.getComponent(cc.Widget).top = 91;
            this.node.getComponent(cc.Button).interactable = true;
        }
    },

    onDestroy() {
        this.index = 0;
        this.isMoving = false;
        this.isRunFinish = true;
        this.unSchedule('close');
        cc.systemEvent.off('ON_BEAT_HTTP_RECEIVED', this.DoHeartBeatMsg, this);
        ff.AccountManager.off('Change_HorseLamp', this.setHorseLamp, this);
    },

    //====================================================================================================
    //** 心跳监听，推送的ID和当前最新ID不一致，则根据心跳的ID拉取最新的跑马灯消息*/
    //====================================================================================================
    DoHeartBeatMsg(event) {
        var heartBeatMsg = event.detail.boardMessages;
        if(!this.isRunFinish || !heartBeatMsg.lastBoardMessageId) return;
        if (this.taskId >= heartBeatMsg.lastBoardMessageId) return;
        this.updataTaskId(heartBeatMsg.lastBoardMessageId);
        this.unSchedule();
    },

    //====================================================================================================
    //** 失败时的定时器 同时根据当前游戏场景 进行相应处理*/
    //** 大厅时 重复滚动之前的数据 同时启动定时器*/
    //** 游戏场景 跑马灯暂时隐藏 同时启动定时器*/
    //** (如果已存在定时器 返回)*/
    //====================================================================================================
    reGetHorseLampMsg() {
        var scene = cc.director.currentScene;
        if (scene === 'GameScene') {
            this.hideHorseLamp();
        } else {
            this.cycleRunHorseLamp();
        }
        if (this.isSchedule) return;
        this.isSchedule = true;
        this.schedule(this.unSchedule, 60);
    },

    //====================================================================================================
    //** 取消定时器 同时把isSchedule状态置为false*/
    //** 根据状态 判断是否要重新拉取跑马灯数据*/
    //====================================================================================================
    unSchedule(flag) {
        flag = flag ==='close';
        this.unschedule(this.unSchedule);
        this.isSchedule = false;
        if (!flag && this.isHorseState && this.isShowHorseLamp) {
            this.getHorseLampMsg();
        }
    },

    //====================================================================================================
    //** 拉取跑马灯数据  */
    //**拉取成功但数据为空，重复滚动之前的数据（游戏内隐藏跑马灯） */
    //**拉取失败也有数据，刷新当前数据，循环滚动 */
    //**拉取失败，重复滚动之前的数据（游戏内隐藏跑马灯） */
    //====================================================================================================
    getHorseLampMsg() {
        if(!this.isShowHorseLamp || !this.isHorseState ) return;
        cc.Linker('GetHorseLamp', { type: 0, lastId: 0 }).showMessage(false).request((data) => {
            this.index = 0;
            if (data.messages.length <= 0) {
                this.isRunFinish = true;
                this.reGetHorseLampMsg();
            }
            else {
                this.isRunFinish = false;
                this.onHorseLampMsg(data);
            }
        }, (data, status) => {
            this.isRunFinish = true;
            if (status !== undefined) {
                cc.Toast(data).show();
            }
            this.reGetHorseLampMsg();
        });
    },

    //====================================================================================================
    //** 更新最新的ID 传入的ID大于当前ID才更新*/
    //====================================================================================================
    updataTaskId(id) {
        if (this.taskId <= id) this.taskId = id;
    },

    //====================================================================================================
    //** 初始化数据*/
    //====================================================================================================
    onHorseLampMsg(data) {
        if (!this.node.active && this.isShowHorseLamp) this.node.active = true;
        this.arrList = data.messages.length >= 20 ? data.messages.slice(0, 20) : data.messages;
        this.cycleRunHorseLamp();
    },

    //====================================================================================================
    //** 跑马灯动作 不影响数据的拉取*/
    //====================================================================================================
    cycleRunHorseLamp() {
        if (this.isMoving) return;
        if (!this.arrList) return;
        if (!this.arrList[this.index]) {
            this.isRunFinish = true;
            this.index = 0;
            this.reGetHorseLampMsg();
            return;
        }
        this.initHorseLampMsg();
    },

    //初始化位置，单个跑马灯
    initHorseLampMsg(data) {
        if (this.isMoving) return;
        var data = data || this.arrList[this.index];
        if(!data) {
            this.cycleRunHorseLamp();
            return;
        }
        var times = data.priority === 1 ? 1 : 0;
        if (this.times > times) {
            this.times = 0;
            this.index++;
        }
        this.horseLampMsg.string = data.content;
        this.horseLampMsg.node.x = this.node.width / 2 - 20;
        this.updataTaskId(data.id);
        this.runHorseLampAction();
    },

    // 执行跑马灯动作
    runHorseLampAction() {
        this.isMoving = true;
        var move_length = this.horseLampMsg.node.parent.width + this.horseLampMsg.node.width + 50;
        this.horseLampMsg.node.runAction(cc.sequence(
            cc.moveBy(this.interval, cc.p(-move_length, 0)),
            cc.callFunc(() => {
                this.isMoving = false;
                this.times++;
                this.initHorseLampMsg();
            })
        ));
    },

    //====================================================================================================
    //** 游戏喜报弹窗*/
    //====================================================================================================
    onGameGoodNews() {
        // var scene = cc.director.currentScene;
        // if(scene === 'GameScene') return;
        // cc.Popup('GameGoodNewsPop').show((node) => {
        //     node.initItem(this.arrList);
        // });
    },

    //====================================================================================================
    //** 没数据时隐藏跑马灯*/
    //====================================================================================================
    hideHorseLamp() {
        if (!this.isMoving && this.node) this.node.active = false;
    },

    //====================================================================================================
    //** 设置跑马灯显示或隐藏 与没数据时隐藏有区别*/
    //====================================================================================================
    setHorseLamp(data) {
        this.isShowHorseLamp = data;
        if (this.isShowHorseLamp) {
            this.unSchedule();
        }
        else this.node.active = this.isShowHorseLamp;
    },
});
