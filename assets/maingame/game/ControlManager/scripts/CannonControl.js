const Cannon = require('Cannon');
const CannonBattery = require('CannonBattery');
const STATE = CannonBattery.STATE;

cc.Class({
    extends: CannonBattery,

    properties: {
        
    },

    onLoad() {
        this._super();
        this.touchTimer = 0;
        this.fireTimer = 0;
        this.firePoint = null;
        this.coins = ff.AccountManager.coins;
        this.jewels = ff.AccountManager.jewels;
        ff.ControlManager.bindBattery(this);
        ff.AccountManager.on('EVENT_COINS_CHANGE', this.onCoins, this);
        ff.AccountManager.on('EVENT_JEWELS_CHANGE', this.onJewels, this);
    },

    onDestroy() {
        ff.AccountManager.off('EVENT_COINS_CHANGE', this.onCoins, this);
        ff.AccountManager.off('EVENT_JEWELS_CHANGE', this.onJewels, this)
    },

    onCoins() {
        this.coins = ff.AccountManager.coins;
        this.state.onCoinsChange();
    },

    onJewels() {
        this.jewels = ff.AccountManager.jewels;
    },

    init(status) {
        this.status = status.init(this);
        this.menu = this.node.addScriptNode(this.status.cannonMenu).init(this);
        this.propButtons = this.node.parent.addScriptNode(this.status.propButtons);
    },

    onAddLevel() {
        // ff.BuryingPoint(3402000006);
        var nextLevel = ff.AccountManager.cannonConfig.getNextLevel(this.level, 1);
        ff.WSLinkManager.send('CannonLevelMsg', { level: nextLevel });
        // if(nextLevel > ff.AccountManager.cannonLevel) this.onLevelChange(nextLevel);
        // else ff.WSLinkManager.send('CannonLevelMsg', { level: nextLevel });
    },

    onSubLevel() {
        // ff.BuryingPoint(3402000007);
        var nextLevel = ff.AccountManager.cannonConfig.getNextLevel(this.level, -1);
        ff.WSLinkManager.send('CannonLevelMsg', { level: nextLevel });
        // if(nextLevel > ff.AccountManager.cannonLevel) this.onLevelChange(nextLevel);
        // else ff.WSLinkManager.send('CannonLevelMsg', { level: nextLevel });
    },

    onMenuClick() {
        cc.log('onMenuClick     ');
        if(this.state.type === STATE.LOCKED) {
            // ff.BuryingPoint(3402000017);
            // return this.showUnlockPop();
        }
        this.menu.toggleMenu();
    },

    showUnlockPop() {
        cc.Popup('CannonUnlockPop').show(null, () => {
            if(this.state.type === STATE.LOCKED) this.onSubLevel();
        });
    },
    
    onTouchStart(pos) {
        this.menu.hideMenu();
        if(this.locate) return this.locate.onTouchStart(pos);
        if(this.touchTimer < Cannon.BULLET_SHOT_DELAY) return;
        this.touchTimer = 0;
        this.fireTimer = 0;
        this.firePoint = pos;
        this.cannon.fire(this.firePoint);
    },

    onTouchMove(pos) {
        if(this.locate) return;
        this.firePoint = pos;
    },

    onTouchEnd(pos) {
        if(this.locate) return;
        if(this.menu.btnAuto.isAutoState()) return;
        this.firePoint = null;
    },

    update(dt) {
        if(!this.menu) return;
        if(this.firePoint !== null) {
            this.fireTimer += dt;
            if(this.fireTimer > Cannon.BULLET_SHOT_DELAY) {
                this.cannon.fire(this.firePoint);
                this.fireTimer = 0;
            }
        }
        this.touchTimer += dt;
        if(this.touchTimer > Cannon.BULLET_SHOT_DELAY) {
            this.touchTimer = Cannon.BULLET_SHOT_DELAY;
        }
    },
    
    /***********override methods***********/
    bulletHitFish(bullet, fish) {
        if(fish.data) {
            ff.WSLinkManager.send('BulletHitFishMsg', {
                fishId: fish.data.id,
                fishOrder: fish.order,
                level: bullet.cannonLevel,
            })
        }
    },

    onPropStart(prop) {
        this._super(prop);
        prop.bindButton(this.propButtons.getButtonById(prop.prop.id));
        
        if(prop.prop.propName !== 'freeze') {
            this.firePoint = null;
            this.menu.stopAutoState();
        }
    },

    setData(data) {
        ff.AccountManager.cannonConfig.skinId = data.skinId;
        return this._super(data);
    },

    onFire(rotation) {

    },
    
    onLevelChange(level) {
        this._super(level);
        this.state.onLevelChange();
        cc.Sound.playSound('sCannonChange');
    },

    onBulletHitFish(data) {
        ff.AccountManager.coins = data.coins;
        ff.AccountManager.jewels = data.jewels;
        if(data.isCaught) {
            ff.FishManager.node.emit('caught-fish', data.fish);
            ff.AwardManager.awardLabels.floatGainCoins(this.getAwardCoinPosition(), data.gainCoins);
        }
    },

    createState(state) {
        var battery = this;
        if (state === STATE.ENABLE) return cc.Class({
            extends: require('CannonState'),
            properties: {},

            onLevelChange() {
                // battery.setState(STATE.ENABLE);
                if(ff.AccountManager.coins < battery.costs) battery.setState(STATE.LOCKED);
                // if(battery.costs > battery.coins) return battery.setState(STATE.SUBING);
            },

            fire(cannon) {
                cc.log('battery cost  '+battery.costs);
                cc.log('battery coins  '+battery.coins);
                if(battery.costs > battery.coins) return battery.setState(STATE.SUBING);
                cc.Sound.playSound('sShot');
                cannon.fireAnim.play();
                ff.WSLinkManager.send('CannonFireMsg', { rotation: cannon.node.rotation });
                return ff.BulletManager.shotBullet(cannon);
            }
        });

        if (state === STATE.SUBING) return cc.Class({
            extends: require('CannonState'),
            properties: {},

            start() {
                //获取当前房间最大炮等级
                //获取当前房间最小炮等级
                cc.log('pao info  ',battery);
                var coins = battery.coins;
                var minMoney = ff.AccountManager.roomConfig.getCurrentRoomMinGold();  //房间的最小金币
                var level = battery.level;
                cc.log('房间当前跑   '+level);
                cc.log('房间最小炮金币   '+minMoney);
                if ((coins < battery.costs) && (coins >= minMoney)){  //钱不足以支付当前的跑
                    // var level = ff.AccountManager.roomConfig.getRoomCannonLevel();  //当前跑等级
                    // cc.log('可以用的跑倍数   '+level);
                    // //设置当前跑等级
                    
                    // battery.onLevelChange(level);
                    // ff.AccountManager.cannonConfig.getNextLevel(level, -1);
                    // this.scheduleOnce(() => ff.WSLinkManager.send('CannonLevelMsg', { level: level }), 1);
                    var getLevel = (l) =>{
                        l = ff.AccountManager.cannonConfig.getNextLevel(l, -1);
                        if (l > coins) return getLevel(l);
                        return l;
                    };
                    level = getLevel(level);
                    ff.WSLinkManager.send('CannonLevelMsg', { level: level });
                    // return cc.Toast('自动切换武器...').setPosition(battery.getAwardAnimPosition()).show();
                    return;
                }
                
                if (coins < minMoney ){
                    ff.WSLinkManager.send('CannonBrokenMsg');
                    return cc.Popup('NewExchangePop').outsideClose(false).show();
                }
                
                // var level = battery.level;
                // var coins = battery.coins;
                // var factor = battery.costs / level;
                // var minLevel = ff.AccountManager.roomConfig.getEnterRoomConfig().enterBatteryLv;
                // /**如果大于最低炮等级，并且金币足够，则可以切换 */
                // // if(level > minLevel && coins >= factor * minLevel) {
                // //     var getLevel = (l) => {
                // //         l = ff.AccountManager.cannonConfig.getNextLevel(l, -1);
                // //         if(factor * l > coins) return getLevel(l);
                // //         return l;
                // //     }
                // //     level = getLevel(level);
                // //     this.scheduleOnce(() => ff.WSLinkManager.send('CannonLevelMsg', { level: level }), 1);
                // //     return cc.Toast('自动切换武器...').setPosition(battery.getAwardAnimPosition()).show();
                // // }
                // /**金币大于最小等级但不足以开炮则充值 */
                // if(coins < battery.costs) return cc.Popup('NewExchangePop').outsideClose(false).show();
                // ff.WSLinkManager.send('CannonBrokenMsg');
            },

            onPropFinish() {
                battery.setState(STATE.ENABLE);
            },

            onCoinsChange() {
                if (battery.coins >= battery.costs) battery.setState(STATE.ENABLE);
            },

            onLevelChange() {
                battery.setState(STATE.ENABLE);
            },
        });

        if (state === STATE.BROKEN) return cc.Class({
            extends: require('CannonState'),
            properties: {},

            start() {
                battery.menu.stopAutoState();
                battery.menu.enableButtons(false);
                battery.assets.nodeBroken.active = true;
                battery.assets.nodeBroken.getComponent(cc.Animation).play();
                battery.status.playBrokenTimer();
                cc.Popup('NewExchangePop').outsideClose(false).show();
            },

            onDisable() {
                battery.assets.nodeBroken.active = false;
                battery.menu.enableButtons(true);
            },

            onCoinsChange() {
                if (battery.coins >= battery.costs) battery.setState(STATE.ENABLE);
            },

            fire(cannon) {
                // if(!battery.locate) ff.PopupManager.showShopPop();
                if(!battery.locate) cc.Popup('NewExchangePop').outsideClose(false).show();
            }
        });

        if (state === STATE.LOCKED) return cc.Class({
            extends: require('CannonState'),
            properties: {},

            start() {
                battery.menu.stopAutoState();
                // battery.menu.iconLock.active = true;
                // battery.status.playLocked(true);
            },

            onDisable() {
                // battery.menu.iconLock.active = false;
                //  battery.status.playLocked(false);
            },

            onLevelChange() {
                if(ff.AccountManager.cannonLevel >= battery.level) battery.setState(STATE.ENABLE);
            },

            fire(cannon) {
                if(battery.costs > battery.coins) return battery.setState(STATE.SUBING);
                cc.Sound.playSound('sShot');
                cannon.fireAnim.play();
                ff.WSLinkManager.send('CannonFireMsg', { rotation: cannon.node.rotation });
                return ff.BulletManager.shotBullet(cannon);
                // if(!battery.locate) battery.showUnlockPop();
            }
        });

        return this._super(state);
    },

});
