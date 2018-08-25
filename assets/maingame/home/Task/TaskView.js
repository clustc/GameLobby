//0：唯一 1：每日 2：每周
const tTaskList = [1, 2];

cc.Class({
    extends: cc.Component,

    properties: {
        contentPrefab: cc.Prefab,
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    onLoad() {
        ff.AccountManager.taskConfig.refreshData(() => {
            this.node.getChildByName('btn_receive_all').on('click', this.OnReceiveAllClicked, this);
            this.node.on('click_start', this.OnTabClickStart, this);
            this.node.on('click_cancel', this.OnTabClickCancel, this);
            // this.node.on('EvevtCloseTaskPop', this.OnClose, this);

            var radioButton = this.node.getComponent('RadioButton');
            var data = ff.AccountManager.switchConfig.data;
            radioButton.buttonArray[0].node.active =data[12].state;
            radioButton.buttonArray[1].node.active =data[13].state;

            if(data[12].state){
                radioButton.setState(0);
            }else if(data[13].state){
                radioButton.setState(1);
            }

            cc.systemEvent.on('EvevtCloseTaskPop', this.OnClose, this);

            this.ControlBtnShowGet(false);
        },'isLoading');
    },

    onDestroy() {
        this.node.off('click_start', this.OnTabClickStart, this);
        this.node.off('click_cancel', this.OnTabClickCancel, this);
        // this.node.off('EvevtCloseTaskPop', this.OnClose, this);

        cc.systemEvent.off('EvevtCloseTaskPop', this.OnClose, this);
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    OnTabClickStart(event) {
        var tab = event.detail.node;
        tab.setLocalZOrder(999);

        var container = this.node.getChildByName('node_content');
        if (!container) { return; }

        var type = parseInt(tab.name.split('_')[1]);
        var subNode = container.getChildByName('content_' + type);
        if (subNode) {
            subNode.active = true;
        } else {
            var content = cc.instantiate(this.contentPrefab);
            content.taskType = type;
            content.name = 'content_' + type;
            container.addChild(content);
        }
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    OnTabClickCancel(event) {
        var tab = event.detail.node;
        tab.setLocalZOrder(-1);

        var container = this.node.getChildByName('node_content');
        if (!container) { return; }

        var type = parseInt(tab.name.split('_')[1]);
        var subNode = container.getChildByName('content_' + type);
        subNode && (subNode.active = false);
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    OnReceiveAllClicked(event) {
        var tab = this.node.getComponent('RadioButton').getCurIndexButton().node;
        var type = parseInt(tab.name.split('_')[1]);
        var taskContentComp = this.node.find('node_content/content_' + type).getComponent('TaskContent');

        var btn = event.target.getComponent(cc.Button);
        btn.interactable = false;
        taskContentComp && taskContentComp.OnReceiveAll(()=>{
            btn.interactable = true;
        },()=>{
            btn.interactable = true;
        });
    },

    onClickTab(param1, param2) {
        var taskContentComp = this.node.find('node_content/content_' + param2);
        if (taskContentComp) {
            taskContentComp.getComponent('TaskContent').UpdateBottom();
        }
    },

    ControlBtnShowGet(isShow) {
        this.node.getChildByName('btn_receive_all').active = isShow;
        this.node.getChildByName('btn_no').active = !isShow;
    },

    OnClose() {
        this.node.emit('close');
    },

});
