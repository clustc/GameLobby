cc.Class({
    extends: require('PropLocate'),

    properties: {

    },

    onEnable() {
        this.hasLocated = false;
        this.setTextView(this.battery.assets.cloneText);
        this.setLocateView(this.battery.assets.locateLine);
        this.setCannonView(this.battery.assets.cloneRing, -1);
        this.isPlayer = this.battery.status;
        this.props = [this];
        this.fishes = [null];
    },

    init(prop, time) {
        this._super(prop, time);
        if(this.isPlayer) for (var i = 0; i < prop.propLevel - 1; i++) this.addProp();
        cc.log('prop leverl    '+prop.propLevel);
    },

    addProp() {
        var cannon = this.cannon.clone();
        var locate = this.node.addComponent('PropLocate');
        locate.cannon = cannon;
        locate.setCannonView(null);
        cannon.node.opacity = 155;
        this.props.push(locate);
        this.fishes.push(null);
    },

    onDisable() {
        while (this.props.length > 1) this.props.pop().destroy();
        this.cannon.cleanClones();
    },

    onTouchStart(pos) {
        var fish = ff.FishManager.getTouchFish(pos);
    
        fish && this.onFishTouch(fish);
    },

    forPropFish(cbk) {
        for(var i in this.props) {
            var fish = this.props[i].getLocateFish();
            if(cbk(fish, i)) break;
        }
    },

    getFishHits(fish) {
        /**获取当前鱼的锁定数 */
        var ret = [];
        this.forPropFish((f, i) => {
            if(f === fish) ret.push(i)
        });
        cc.log('getFishHits   '+ret);
        return ret;
    },

    onFishTouch(fish) {
        cc.log('onFishTouch   ',fish);
        /**刷新下所有鱼 */
        for(var i in this.props) this.fishes[i] = this.props[i].getLocateFish();

        /**全部锁定一条鱼则播放一下动画 */
        if(this.getFishHits(fish).length === this.props.length) 
            return this.props[0].views.line.animTarget();

        var index = -1;
        /**从空闲的炮中选一个攻击 */
        this.forPropFish((f, i) => {
            if(!f) {
                index = i;
                return true;
            }
        });
        /**从多个锁定中选一个攻击 */
        if(index < 0) {
            this.forPropFish((f, i) => {
                if(f !== fish) {
                    var hits = this.getFishHits(f);
                    if(hits.length > 1) {
                        index = hits[0];
                        return true;
                    }
                }
            });
        }
        /**从三个炮中随机选一个 */
        if(index < 0) {
            this.forPropFish((f, i) => {
                if(f !== fish) {
                    index = i;
                    return true;
                }
            });
        }
        /**赋值并发送消息 */
        if(index >= 0) {
            this.fishes[index] = fish;
            this.sendMessage();
        }
    },

    sendMessage() {
        var targets = [];
        for(var i in this.fishes) {
            var fish = this.fishes[i];
            targets.push({
                fishId: fish ? fish.data.id : -1,
                fishOrder: fish ? fish.order : -1,
            });
        }
        cc.log('锁定鱼    '+targets);
        ff.WSLinkManager.send('CannonLocateMsg', { targets: targets });
    },

    onLocateFish(data) {
        cc.log('ProopClone on onLocateFish    ',data);
        for (var i = 0; i < data.length; i++) {
            if(!this.props[i]) this.addProp();
            if(data[i].fishId === -1) continue;
            var fish = ff.FishManager.getFishById(data[i].fishId, data[i].fishOrder);
            this.props[i].setLocateFish(fish);
        }
    }
});
