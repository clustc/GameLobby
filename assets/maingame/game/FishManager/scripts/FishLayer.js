const FishData = require('FishData');
const FishInfo = FishData.FishInfo;
const FishPath = FishData.FishPath;
FishInfo.fish_shoal = {"name":"fish_shoal","type":"SHOAL","stand":true,"death":"S"};
FishPath.fish_shoal = {"velocity":1,"pointxs":[-937,0,937],"pointys":[638,638,638],"lengths":[1874]};

cc.Class({
    extends: require('PoolLayer'),

    properties: {

    },

    onLoad() {
        this.flipXY = 0;
        this.fishes = [];
        this.fishqueue = [];
        this.timestamp = 0;
    },

    produce(name) {
        var fish = this._super(name);
        fish.flipXY = this.flipXY;
        fish.anim.flipXY = this.flipXY;
        fish.anim.play();
        this.fishes.push(fish);
        return fish;
    },

    createObject(name) {
        var node = new cc.Node();
        node.parent = this.node;
        node.x = node.y = 10000;
        return node.addComponent('Fish').init(FishInfo[name]);
    },

    resetObject(fish, name) {
        this.fishes.splice(this.fishes.indexOf(fish), 1);
        fish.node.x = fish.node.y = 10000;
        fish.reset();
    },

    callFishesMethod(method, value) {
        for (var i = this.fishes.length - 1; i >= 0; i--) this.fishes[i][method](value);
    },

    forViewFish(callback) {
        for (var i = this.fishes.length - 1; i >= 0; i--) {
            var fish = this.fishes[i];
            if (fish.data && !fish.caught && fish.anim.visible) {
                if (callback(fish)) break;
            }
        }
    },

    forEachFish(callback) {
        for (var i = this.fishes.length - 1; i >= 0; i--) {
            if (this.fishes[i].data && callback(this.fishes[i])) break;
        }
    },

    bornFish(data) {
        var info = FishInfo[data.name]; if(!info) return cc.error('No Info => ', data.name);
        var path = FishPath[data.name]; if(!path) return cc.error('No Path => ', data.name);
        var name = info.name;
        if(name === 'fish_shoal') this.produce(name).parseShoal(data, info, FishPath[name], this.timestamp);
        else this.produce(name).parse(data, info.group, path[data.path], this.timestamp);
    },

    bornShoal(data) {
        var info = FishInfo[data.name];
        var path = FishPath[data.name][data.path];
        var team = info.group;
        for(var i in team) this.produce(team[i].name).parse(data, team[i], path[i], this.timestamp);
        this.fishqueue = [];
    },

    update(dt) {
        if (ff.FishManager.isState(ff.FishManager.STATE.FREEZE)) return;
        if (this.fishqueue.length > 0) {
            this.bornFish(this.fishqueue.shift());
            this.timestamp += dt;
        }
    },
});
