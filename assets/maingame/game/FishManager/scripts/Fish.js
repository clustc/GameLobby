cc.Class({
    extends: require('FishMove'),

    properties: {
        
    },

    onLoad() {
        this.order = 0;
        this.data = null;
        this.caught = false;
        this.anim = this.node.addComponent('FishAnim');
        this.team = this.node.addComponent('FishTeam');
    },

    init(info) {
        this.info = info;
        this.anim.init(info);
        this.node.setLocalZOrder(info.value * 100000);
        return this;
    },

    reset() {
        this._super();
        this.order = 0;
        this.data = null;
        this.caught = false;
        this.anim.reset();
        this.team.reset();
        this.node.setScale(1);
        this.node.setOpacity(255);
        this.node.stopAllActions();
    },

    clone() {
        var fish = ff.FishManager.fishLayer.produce(this.info.name);
        fish.data = this.data;
        fish.curve = this.curve;
        fish.flipXY = this.flipXY;
        fish.stopped = this.stopped;
        fish.velocity = this.velocity;
        return fish;
    },

    parse(data, team, path, timestamp) {
        this.data = data;
        this.path = path;
        this.team.data = team;
        this.team.dead = data.dead;
        this.timestamp = timestamp - data.time;
        this.ready();
    },

    parseShoal(data, info, path, timestamp) {
        this.timestamp = timestamp - data.time;
        if(this.timestamp > info.duration) return this.onFinish();
        this.data = data;
        this.caught = true;
        this.path = path;
        this.velocity = this.longness / info.duration;
        this.readyMove();
    },

    ready() {
        if(!this.team.ready()) this.readyMove();
    },

    update(dt) {
        this.updates(dt);
        this.team.updates(dt);
    },

    moving(pos) {
        this.anim.moving(pos);
        this.node.position = pos;
    },

    onReady() {
        ff.FishManager.onFishReady(this);
    },

    onBegin() {
        ff.FishManager.onFishBegin(this);
    },

    onFinish() {
        ff.FishManager.onFishFinish(this);
    },

    pause() {
        this.stopped = true;
        this.anim.pause();
    },

    resume() {
        this.stopped = false;
        this.anim.resume();
    },

    fadeout() {
        if(this.caught) return;
        this.caught = true;
        this.velocity = 600;
        this.node.runAction(cc.sequence(cc.fadeOut(1.5), cc.callFunc(this.onFinish, this)));
    },

    checkHit(pos) {
        return cc.pointInRotatedRect(pos, this.node.getBoundingBox(), this.anim.rotation);
    },

    showHit() {
        this.anim.onHit();
    },

    showDie() {
        cc.Sound.playSound(this.info.name);
        var death = this.info.death;
        this.pause();
        this.caught = true;
        if(death === 'C') return this.anim.showDie(() => this.onFinish());
        var delay = 1.2;
        this.anim.play(2);
        this.node.setScale(1.6);
        this.scheduleOnce(this.onFinish, delay);
        if(death === 'M') return this.anim.runAction(cc.rotateBy(delay, 420));
        if(death === 'L') return this.schedule(() => this.anim.rotation += Math.rand(45, 135), 0.16, Math.floor(delay / 0.16));
    },

});
