const PROP_NAMES = ['locate', 'freeze', 'crazy', 'clone'];

cc.Class({
    extends: cc.Component,

    properties: {
        buttonItem: cc.Node,
    },

    onLoad() {
        this.hideCostTips = ff.GameManager.getItem('HIDE_COST_JEWEL_TIPS');
        this.propButtons = [];
        this.buttonItem.parent = null;
        for(var i in PROP_NAMES) {
            var prop = ff.AccountManager.propsConfig.getPropByName(PROP_NAMES[i]);
            cc.log('prop init   '+JSON.stringify(prop));
            var button = cc.instantiate(this.buttonItem).getComponent('PropCoolDown');
            button.propId = prop.propId;
            button.propName = prop.propName;
            button.iconSprite.spriteFrame = prop.spriteFrame;
            button.node.on('button-click', this.onButtonClick, this);
            button.node.parent = this.node;
            this.propButtons.push(button);
        }
        ff.AccountManager.on('EVENT_PROPS_CHANGE', this.onPropsChange, this);
        ff.AccountManager.on('EVENT_REFRESH_ACCOUNT', this.onPropsChange, this);
        this.onPropsChange();
    },

    onDestroy() {
        ff.AccountManager.off('EVENT_PROPS_CHANGE', this.onPropsChange, this);
        ff.AccountManager.off('EVENT_REFRESH_ACCOUNT', this.onPropsChange, this);
    },

    updatePropCount(prop, button) {
        cc.log("updatePropCount    "+JSON.stringify(prop));
        if(prop.propNum > 0) button.count = prop.propNum;
        else button.count = 'x'+prop.buyCoin;
        // else button.setJewelCost(prop.buyDiamond);
    },

    onPropsChange() {
        for(var i = 0; i < PROP_NAMES.length; i++) {
            var prop = ff.AccountManager.propsConfig.getPropByName(PROP_NAMES[i]);
            var button = this.getButtonById(prop.propId);
            var room = ff.AccountManager.roomConfig;
            var proplist = room.getRoomCanUseProplist();
            cc.log('user Pop list    '+proplist);
            cc.log('user Pop id    '+proplist.indexOf(prop.id));
            if (proplist.indexOf(prop.id) != -1){
                button.setLocked(false);
                this.updatePropCount(prop, button);
            }else{
                button.setLocked(true);
                button.count = prop.buyCoin;
            }
            // if(i < 2) {
            //     this.updatePropCount(prop, button);
            // } else {
            //     button.setLocked(!prop.propEnabled);
            //     prop.propEnabled && this.updatePropCount(prop, button);
            // }
        }
    },

    /**获取当前使用的道具 */
    getCoolingButton() {
        for(var i in this.propButtons) {
            var button = this.propButtons[i];
            if(button.isCooling() && button.propName != 'freeze') return button;
        }
        return null;
    },

    onButtonClick(event) {
        var button = event.target.getComponent('PropCoolDown');
        
        if(button.iconLock.active) {
            var prop = ff.AccountManager.propsConfig.getPropById(button.propId);
            if (prop.propId == 13){  //狂暴
                return cc.Toast('阳光海滩以上房间可以解锁道具哦').show();
            }else if (prop.propId == 16){
                return cc.Toast('潜龙深渊以上房间可以解锁道具哦').show();
            }
            
        }
        if(button.propName == 'freeze') {
            this.onUseProp(button);
        } else {
            var cooling = this.getCoolingButton();
            if(cooling) {
                var prop = ff.AccountManager.propsConfig.getPropById(cooling.propId);
                cc.Toast('您正在使用[' + prop.name + ']道具，稍后再试...').show();
            } else {
                this.onUseProp(button);
            }
        }
    },

    onUseProp(button) {
        var prop = ff.AccountManager.propsConfig.getPropById(button.propId);
        cc.log('clock  '+prop.propNum);
        if(prop.propNum > 0) {
            ff.WSLinkManager.send('CannonPropMsg', { propId: button.propId });
        } else {
            if(this.hideCostTips === 'true') {
                ff.WSLinkManager.send('CannonPropMsg', { propId: button.propId });
            } else {
                cc.Popup('ToastDialogPop').shadowOpacity(0).show(pop => {
                    pop.node.y = -150;
                    pop.setTitle('使用[' + prop.name + ']将消耗' + prop.buyCoin + '金币');
                    pop.onEnsure(() => ff.WSLinkManager.send('CannonPropMsg', { propId: button.propId }));
                    pop.onCancel(() => {});
                    pop.onToggle(event => {
                        this.hideCostTips = event.detail.isChecked ? 'true' : 'false';
                        ff.GameManager.setItem('HIDE_COST_JEWEL_TIPS', event.detail.isChecked);
                    });
                });
            }
        }
    },

    getButtonById(propId) {
        for(var i in this.propButtons) {
            var button = this.propButtons[i];
            if(button.propId == propId) return button;
        }
    }
});
