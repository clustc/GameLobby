const FishNoShadow = ['fish_xiaosanyuan', 'fish_xiaosiyuan', 'fish_zhuanpanyu1', 'fish_zhuanpanyu2']
const FishType = ['NORMAL', 'AWARD', 'SPECIAL', 'BOSS'];

cc.Class({
    extends: cc.Component,

    properties: {
        rotation: {
            set(r) {
                this.sprite.rotation = r;
                this.shadow && (this.shadow.rotation = r);
            },
            get() {
                return this.sprite.rotation;
            }
        },
        visible: {
            set(v) {
                this._visible = v;
            },
            get() {
                return this._visible;
            }
        },
        flipXY: {
            set(f) {
                if(!this._rotate) this.setScale(f === 3 ? -1 : 1, 1);
            }
        }
    },

    onLoad() {
        this._hitTimer = -1;
        this._rotate = true;
        this._visible = false;
    },

    init(info) {
        this._rotate = !info.stand;
        this.sprite = ff.ConstAssets.produceFishAnim(info.name);
        this.sprite.x = this.sprite.y = 0;
        this.sprite.parent = this.node;
        this.node.width = this.sprite.width;
        this.node.height = this.sprite.height;
        this.createShadow(info);
    },

    reset() {
        this._hitTimer = -1;
        this._visible = false;
        this.rotation = 0;
        this.pause();
        this.setColor(cc.color(255, 255, 255));
    },

    createShadow(info) {
        if(info.type === 'BOSS' || FishNoShadow.indexOf(info.name) >= 0) return;
        this.shadow = cc.instantiate(this.sprite);
        this.shadow.y = -50 - FishType.indexOf(info.type) * 50;
        this.shadow.setLocalZOrder(-1);
        this.shadow.opacity = 100;
        this.shadow.parent = this.node;
        /**去掉粒子特效节点 */
        var partsNode = [ 'fish_jinguang_tx', 'fish_yinguang_tx', 'fish_yinlong_tx' ];
        for (var i in partsNode) {
            var particle = this.shadow.find(partsNode[i]);
            particle && (particle.parent = null);
        }
        var sprites = this.shadow.getComponentsInChildren(cc.Sprite);
        for (var i in sprites) sprites[i].node.setColor(cc.color(0, 0, 0));
    },

    callAnimsMethod(node, method) {
        if(!node) return;
        var anims = node.getComponentsInChildren(cc.Animation);
        for (var i in anims) anims[i][method]();
    },

    callAnimsStateMethod(node, speed) {
        if(!node) return;
        speed = speed || 1;
        var anims = node.getComponentsInChildren(cc.Animation);
        for (var i in anims) {
            var state = anims[i].play();
            state.time = 0;
            state.speed = speed;
        }
    },

    play(speed) {
        this.callAnimsStateMethod(this.sprite, speed);
        this.callAnimsStateMethod(this.shadow, speed);
    },

    pause() {
        this.callAnimsMethod(this.sprite, 'pause');
        this.callAnimsMethod(this.shadow, 'pause');
    },

    resume() {
        this.callAnimsMethod(this.sprite, 'resume');
        this.callAnimsMethod(this.shadow, 'resume');
    },

    setColor(color) {
        if (!this.setSpriteChildColor(this.sprite, color)) {
            var childs = this.sprite.children;
            for (var i = childs.length - 1; i >= 0; i--) this.setSpriteChildColor(childs[i], color);
        }
    },

    setScale(x, y) {
        this.sprite.setScale(x, y);
        this.shadow && this.shadow.setScale(x, y);
    },

    runAction(action) {
        this.sprite.runAction(action);
        this.shadow && this.shadow.runAction(action.clone());
    },

    setSpriteChildColor(node, color) {
        var hasSpriteChild = false;
        var childs = node.children;
        for (var i = childs.length - 1; i >= 0; i--) {
            if (childs[i].getComponent(cc.Sprite)) {
                childs[i].setColor(color);
                hasSpriteChild = true;
            }
        }
        return hasSpriteChild;
    },

    getBoundingBox() {
        var rect = this.sprite.getBoundingBox();
        rect.center = this.node.position;
        return rect;
    },

    onHit() {
        if (this._hitTimer < 0) this.setColor(cc.color(255, 120, 120));
        this._hitTimer = 0;
    },

    showDie(cbk) {
        this.sprite.getComponent(this.sprite.name).showDie(cbk);
        this.shadow && this.shadow.getComponent(this.shadow.name).showDie();
    },

    update(dt) {
        if(this._hitTimer >= -0.5) {
            this._hitTimer += dt;
            if(this._hitTimer > 0.5) {
                this._hitTimer = -1;
                this.setColor(cc.color(255, 255, 255));
            }
        }
    },

    moving(pos) {
        if(this._rotate) {
            var offset = cc.pSub(pos, this.node.position);
            this.rotation = -cc.radiansToDegrees(Math.atan2(offset.y, offset.x));
            this.setScale(1, offset.x > 0 ? 1 : -1);
        }
        var bound = this.getBoundingBox();
        this.visible = cc.rectIntersectsRect(cc.screenBoundingBox, bound) || cc.rectOverlapsRect(cc.screenBoundingBox, bound);
    },

    _debugDrawHitBox(sprite) {
        var n = new cc.Node();
        var w = sprite.width;
        var h = sprite.height;
        var graphics = n.addComponent(cc.Graphics);
        n.parent = sprite;
        graphics.lineWidth = 4;
        graphics.strokeColor = cc.hexToColor('#ff0000');
        graphics.rect(-w / 2, -h / 2, w, h);
        graphics.stroke();
    },
});
