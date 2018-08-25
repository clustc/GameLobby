cc.Class({
    extends: cc.Component,

    properties: {
        tabView:cc.Node,
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    onLoad() {
        this.node.on('OnContentLoaded', this.OnMailContentLoaded, this);
        this.node.on('OnMailReaded', this.OnMailReaded, this);

        this.redPoint = this.node.getComponent('PrefabAttach');
        this.redPoint.Reg('HasMailNotRead', this.node.find('MailTabView/node_tab/tab_1'));
        this.redPoint.Reg('HasMailNotRead', this.node.find('MailTabView/node_tab/tab_2'));
        this.redPoint.Reg('HasMailNotRead', this.node.find('MailTabView/node_tab/tab_3'));

        this.setIsOpen();
    },
    /*====================================================================================================
    /每个邮件被标记为已读取后的回调
    /====================================================================================================*/
    OnMailReaded(event) {
        event.stopPropagation();
        var type = event.detail.type;
        var allReaded = this.redPoint.HasAnyAttachShow('MailReadState_' + type);
        if (allReaded === true) {
            this.node.emitEvent('HasMailNotRead', {
                action: 'detach',
                matchfunc: (node) => {
                    return node.name.split('_')[1] === type.toString();
                },
            });
        }
    },

    setIsOpen() {
        var tabViewContent = this.tabView;
        var tabView = this.node.getComponent('TabView');
        var data = ff.AccountManager.switchConfig.data;

        tabViewContent.children[0].active =data[22].state;
        tabViewContent.children[1].active =data[23].state;
        tabViewContent.children[2].active =data[24].state;

        if (data[22].state) {
            tabView._curTabIndex = 0;
            return;
        } else if (data[23].state) {
            tabView._curTabIndex = 1;
            return;
        } else if (data[24].state) {
            tabView._curTabIndex = 2;
            return;
        }
    },



    /*====================================================================================================
    /
    /====================================================================================================*/
    start() {
        this.CheckTabReadPoint()
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    CheckTabReadPoint() {
        cc.Linker('GetUnReadTypes').request((data) => {
                data.types && data.types.forEach((type) => {
                    this.node.emitEvent('HasMailNotRead', {
                        action: 'attach',
                        align: 'TopRight',
                        matchfunc: (node) => {
                            return node.name.split('_')[1] === type.toString();
                        }
                    });
                });
            });
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    onDestroy() {
        this.node.off('OnContentLoaded', this.OnMailContentLoaded, this);
        this.node.on('OnMailReaded', this.OnMailReaded, this);
        this.redPoint.UnReg('HasMailNotRead');
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    FecthMailData(type, callback) {
        cc.Linker('GetEmail', { type: type }).showLoading(true).request(callback);
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    OnMailContentLoaded(event) {
        event.stopPropagation();

        var comp = event.detail;
        var name = comp.node.name;
        var type = null;

        if (name === 'MailSystem') {
            type = 1;
        }
        else if (name === 'MailPush') {
            type = 2;
        }
        else if (name === 'MailBox') {
            type = 3;
        }

        if (!type) { return; }

        this.FecthMailData(type, data => {
            comp.AddRadioButtons(this, data);
        })
    }
});
