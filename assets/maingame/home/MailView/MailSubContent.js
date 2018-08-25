cc.Class({
    extends: cc.Component,

    properties: {
        attachItemPrefab : cc.Prefab,
    },

    /*====================================================================================================
    /
    /====================================================================================================*/    
    onLoad() {
        this._lblTittle = this.node.getChildByName('lbl_tittle');
        this._lblTime = this.node.getChildByName('lbl_time');
        this._lblContent = this.node.getChildByName('lbl_content');

        this.ShowOrHideNodeAttach(false);
        this.RegButtonClickEvent();
    },

    /*====================================================================================================
    /
    /====================================================================================================*/ 
    RegButtonClickEvent() {
        var nodeAttachment = this.node.getChildByName('node_bottom');
        if (nodeAttachment) {
            var btnReceive = nodeAttachment.getChildByName('btn_receive');
            btnReceive.on('click',() => {
                cc.Linker('GetAttachment',{mailId : this.data.id})
                .request((data) => {
                     if (data instanceof Object) {
                        cc.Toast('领取成功').show();
                        this.data.attachmentReceivingTime = "1";
                        this.ShowOrHideNodeAttach(false);
                     }else if (typeof(data) === 'string') {
                        cc.Toast(data).show();
                     }
                });
            },this)
        }
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    ShowOrHideNodeAttach(bShow) {
        var nodeAttachment = this.node.getChildByName('node_bottom');
        if (nodeAttachment) {
            nodeAttachment.active = bShow
        }
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    AddItemToNodeAttach(nodeRerawd,data) {
        if (nodeRerawd && this.attachItemPrefab) {
            var item = cc.instantiate(this.attachItemPrefab);
            item.getScript().initItem(data,true);
            nodeRerawd.addChild(item);
        }
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    UpdateView(data) {
        if (!data) { return; }

        this.data = data;
        this.node.active = true; 

        this._lblTittle.getComponent(cc.Label).string = data.subTitle;
        this._lblTime.getComponent(cc.Label).string = data.createTime;
        this._lblContent.getComponent(cc.Label).string = data.content;
        
        this.UpdateAttachNode();

        if (data.readStatus !== 1) {
            cc.Linker('SetMailReaded',{idList : [this.data.id]})
            .request((msg) => {
                this.BroadcastMailReaded();
                this.node.emitEvent('OnMailReaded',{
                    type : data.type,
                });
            });
        }
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    BroadcastMailReaded(){
        this.node.emitEvent('MailReadState_' + this.data.type,{
            action : 'detach',
            matchfunc : (node) => {
                if (node.data.id === this.data.id){
                    return true;
                }
            }
        });
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    UpdateAttachNode() {
        var nodeAttachment = this.node.getChildByName('node_bottom');
        if (!nodeAttachment) { return; }
        var nodeRerawd = nodeAttachment.getChildByName('node_reward');
        nodeRerawd.removeAllChildren();

        var receiveTime = this.data.attachmentReceivingTime;
        if (receiveTime) {
            this.ShowOrHideNodeAttach(false);
            return;
        }

        if(!this.data.attachment)  {
            this.ShowOrHideNodeAttach(false);
            return;
        }
        var attachList = this.data.attachment.split(',')
        var attachCount = attachList.length;
        if (attachCount > 0) { this.ShowOrHideNodeAttach(true); }

        for (var i = 0; i < attachCount; i++){
            var singleData = attachList[i].split(':');
            var propId =  parseInt(singleData[0]);
            var propNum = parseInt(singleData[1]);
            //add item
            this.AddItemToNodeAttach(nodeRerawd,{
                propId : propId,
                propNum : propNum,
            });
        }      
    }

});
