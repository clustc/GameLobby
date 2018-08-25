require('CCGlobal');
var isShowSignPop = false;

const PopupManager = cc.Class({

    properties: {

    },

    /**对话框，带确定取消按钮 */
    showDialogPop(message, okCbk, noCbk) {
        cc.Popup('ToastDialogPop').outsideClose(false).show(pop => {
            pop.setTitle(message);
            okCbk && pop.onEnsure(okCbk);
            noCbk && pop.onCancel(noCbk);
        });
    },

    /**底部提示框，带按钮 */
    showToastPop(message, okCbk, noCbk) {
        var pop = cc.Popup('ToastDialogPop');
        pop.shadowOpacity(0);
        pop.show(pop => pop.setTitle(message).onEnsure(okCbk).onCancel(noCbk));
    },

    /**商城 */
    showShopPop(flag) {
        if (ff.AccountManager.recharge === 0 && ff.AccountManager.switchConfig.data[1].state) {
            ff.BuryingPoint(3401000008);
            return cc.Popup('FirstChargePop').outsideClose(false).show(null, () => {
                cc.Popup('ShopPop').show((node) => node.init(flag));
            });
        }
        ff.BuryingPoint(3401020002);
        cc.Popup('ShopPop').show((node) => node.init(flag));
    },

    sailPackagePop() {
        var data = ff.AccountManager.switchConfig.data;
        if (ff.AccountManager.sailPackage.length > 0 && data[31].state) {
            /**游戏-启航礼包弹出 */
            ff.BuryingPoint(3402000001);
            cc.Popup('SailPackagePop').outsideClose(false).show(null,(flag)=>{
                if(flag){
                    ff.GameManager.enterGameRoom(ff.AccountManager.roomConfig.defaultRoomId);
                }
            });
        }else if(ff.AccountManager.signConfig.isTodaySigned() && data[19].state){
            if(!isShowSignPop) { 
                isShowSignPop = true;
                this.signPop();
            }
        }
    },

    signPop(){
        cc.Popup('SignInPop').show(null,(flag)=>{
            if(flag) ff.AccountManager.signConfig.refreshData();
        });
    },

    /**获得奖励弹窗*/
    showAwardTips(data,hideCbk) {
        /*data 格式  data = [{propId: xxx ,propNumAdd: yyy ,propDesc: zzz }]*/
        /*propNumAdd 和 PropDesc 可选择性传入  但都有时取PropNumAdd */ 
        if (!data) return;
        cc.Popup('AwardTipsPop').outsideClose(false).show(pop => pop.UpdatePop(data), hideCbk);
        cc.Sound.playSound('sAcceptAward');
    },

    showVipGiftPop(cbk) {
        cc.Linker('EnableAutoFire').request(data => {
            if(data.mark == 1) cbk && cbk();
            else cc.Popup('VipGiftPop').show();
        });
    },
})

ff.PopupManager = new PopupManager();