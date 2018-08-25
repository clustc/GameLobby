cc.Class({
    extends: cc.Component,

    properties: {
        contentView : cc.Node,
        tabContainer : cc.Node,
        nodeTips : cc.Node,
        tabPrefab : cc.Prefab,
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    onLoad() {
        this.node.on('click_start', this.OnTabClickStart, this);
        this.node.on('click_cancel', this.OnTabClickCancel, this);
        
        this.node.emitEvent('OnContentLoaded', this);
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    AddRadioButtons(root,data,initIndex) {
        var count = data.length;
        if (count > 0) {
            for (var i = 0; i < count; i++) {
                var node = cc.instantiate(this.tabPrefab);
                node.data = data[i];
                node.getComponentInChildren(cc.Label).string = data[i].title;
                
                this.tabContainer.addChild(node);
                this.node.getComponent('RadioButton').pushNode(node);
                root.redPoint.Reg('MailReadState_' + data[i].type,node);
            }
            this.FakeClickTab(initIndex || 0);
            this.CheckRedPoint()

            this.contentView && (this.contentView.active = true);
            this.nodeTips && (this.nodeTips.active = false);
        }else {
            this.contentView && (this.contentView.active = false);
            this.nodeTips && (this.nodeTips.active = true);

            var receiveSetting = this.node.getChildByName("MailReceiveSetting");
            receiveSetting && (receiveSetting.x = 50);
        }

        this.node.getComponent('RadioButton').setState(0);
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    CheckRedPoint() {
        this.tabContainer.children.forEach(child => {
            var isReaded = child.data.readStatus === 1;
            if (isReaded === false) {
                this.node.emitEvent('MailReadState_' + child.data.type,{
                    action : 'attach',
                    align : 'TopLeft',
                    matchfunc : (node) => {
                        if (node === child){
                            return true;
                        }
                    }
                });
            }
        });
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    FakeClickTab(index) {
        var comp = this.tabContainer.getComponent('RadioButton');
        if (!comp) {
            cc.error('Tab Container must have component RadioButton');
            return;
        }
        comp.setState(index);
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    UpdateSubContent(data) {
        var subContentComp = this.contentView.getComponent('MailSubContent')
        if (subContentComp) {
            subContentComp.UpdateView(data)
        }
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    OnTabClickStart(event) {
        event.stopPropagation();
        var tabNode = event.detail.node;
        this.UpdateSubContent(tabNode.data);
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    OnTabClickCancel(event) {
        event.stopPropagation();
        //do nothing..
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    onDestroy() {
        this.node.off('click_start', this.OnTabClickStart, this);
        this.node.off('click_cancel', this.OnTabClickStart, this);
    },

});
