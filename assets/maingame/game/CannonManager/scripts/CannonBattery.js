const STATE = {
    HIDDEN: 'HIDDEN',//等待中
    ENABLE: 'ENABLE',//可开炮
    LOCKED: 'LOCKED',//未解锁
    SUBING: 'SUBING',//切炮中
    BROKEN: 'BROKEN',//已破产
};

cc.Class({
    extends: cc.Component,

    properties: {
        coins: {
            set(coins) {
                this._coins = coins;
                this.assets.labelCoins.string = coins;
            },
            get() {
                return this._coins;
            }
        },
        jewels: {
            set(jewels) {
                this._jewels = jewels;
                this.assets.labelJewels.string = jewels;
            },
            get() {
                return this._jewels;
            }
        },
        level: {
            set(level) {
                this._level = this._costs = level;
                cc.log('set lvel   '+level);
                this.assets.labelLevel.string = level;
                if(this.locate && this.locate.prop.propName === 'crazy') {
                    this._costs = this.locate.prop.propLevel * level;
                }
            },
            get() {
                return this._level;
            }
        },
        costs: {
            get() { return this._costs; }
        }
    },

    statics: {
        STATE: STATE,
    },

    onLoad() {
        this._level = 0;
        this._costs = 0;
        this._coins = 0;
        this._jewels = 0;
        this.locate = null;
        this.assets = this.node.getComponent('CannonAssets');
        this.rotation = this.assets.nodeStage.rotation;
        this.cannon = this.assets.cannon.init(this);
        this.state = this.node.addComponent(this.createState(STATE.HIDDEN));
    },

    onPropStart(prop) {
        cc.log('onPropStart   ',prop);
        if(prop.prop.propName !== 'freeze') this.locate = prop;
        if(prop.prop.propName === 'crazy')  this._costs = prop.prop.propLevel * this._level;
        this.state.onPropStart(prop);
    },

    onPropFinish(prop) {
        if(prop === this.locate) this.locate = null;
        if(prop.prop.propName === 'crazy') this._costs = this._level;
        this.state.onPropFinish(prop);
    },

    cleanProps() {
        this.locate && this.locate.destroy();
        this.locate = null;
    },

    setState(state) {
        
        if(this.state.type === state) return;
        this.state.destroy();
        this.state = this.node.addComponent(this.createState(state));
        this.state.type = state;
    },

    playShow() {
        this.assets.nodeWaiting.active = false;
        this.node.stopAllActions();
        this.node.runAction(cc.moveTo(0.3, this.assets.showPosition));
    },

    playHide(cbk) {
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(
            cc.moveTo(0.3, this.assets.hidePosition),
            cc.callFunc(() => {
                this.assets.nodeWaiting.active = true;
                this.cannon.node.rotation = this.rotation;
                cbk && cbk();
            })
        ));
    },

    bulletHitFish(bullet, fish) {

    },
    
    getCannonPosition() {
        return this.assets.cannonPosition;
    },

    getAwardAnimPosition() {
        return this.assets.awardAnimPosition;
    },

    getAwardCoinPosition() {
        return this.assets.awardCoinPosition;
    },

    createState(state) {
        var battery = this;
        if (state === STATE.HIDDEN) return cc.Class({
            extends: require('CannonState'),
            properties: {},
            start() {
                battery.cleanProps();
            },
        });
        if (state === STATE.ENABLE) return cc.Class({
            extends: require('CannonState'),
            properties: {},
            fire(cannon) {
                cc.log('battery cost 11111 '+battery.costs);
                cc.log('battery coins  1111111'+battery.coins);
                if(battery.costs > battery.coins) return;
                cannon.fireAnim.play();
                return ff.BulletManager.shotBullet(cannon);
            }
        });
        if (state === STATE.SUBING) return cc.Class({
            extends: require('CannonState'),
            properties: {},
        });
        if (state === STATE.BROKEN) return cc.Class({
            extends: require('CannonState'),
            properties: {},
            start() {
                battery.assets.nodeBroken.active = true;
                battery.assets.nodeBroken.getComponent(cc.Animation).play();
            },

            onDisable() {
                battery.assets.nodeBroken.active = false;
            },

            onCoinsChange() {
                if (battery.coins >= battery.costs) battery.setState(STATE.ENABLE);
            },
        });
        return null;
    },

    /************on ws cbk************/
    setData(data) {
        cc.log('batter init data  '+JSON.stringify(data));
        /**没有数据则隐藏 */
        if(this.data && !data) {
            this.data = null;
            this.setState(STATE.HIDDEN);
            this.playHide();
            return true;
        }
        var initData = () => {
            this.data = data;
            this.onLevelChange(data.level);
            this.setState(STATE.ENABLE);
            this.onBulletHitFish(data);
            this.onSkin(data.skinId);
            this.playShow();
        }
        /**有新数据则显示 */
        if(!this.data && data) {
            initData();
            return true;
        }
        /**是新玩家则退出再显示 */
        if(this.data && this.data.id != data.id) {
            this.data = null;
            this.setState(STATE.HIDDEN);
            this.playHide(initData);
            return true;
        }
        return false;
    },

    onFire(rotation) {
        if(this.locate) return;
        this.cannon.fireAngle(rotation);
    },

    onSkin(skinId) {
        this.cannon.setWearSkin(skinId);
    },

    onBroken() {
        cc.log('onBroken');
        this.setState(STATE.BROKEN);
    },

    onUseProp(data) {
        
        var prop = ff.AccountManager.propsConfig.getPropById(data.propId);
        var name = 'Prop' + prop.propName.slice(0, 1).toUpperCase() + prop.propName.slice(1);
        cc.log('onUseProp    '+JSON.stringify(data) +'script name    '+name);
        this.node.addComponent(name).init(prop, data.propTime);
    },

    onLevelChange(level) {
        this.level = level;
        this.cannon.skinBase = this.assets.getBaseSkin(level);
        this.cannon.setSkin();
    },

    onLocateFish(data) {
        cc.log('Battery locate fish   ',data);
        cc.log('Battery locate fish   ',this.locate);
        this.locate && this.locate.onLocateFish(data);
    },

    onBulletHitFish(data) {
        
        this.coins = data.coins;
        this.jewels = data.jewels;
        this.state.onCoinsChange();
    },
});
