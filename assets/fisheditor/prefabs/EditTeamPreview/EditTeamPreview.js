cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    getOffset(percent, length) {
        var rad = Math.PI * 2 * percent + Math.PI / 2;
        return cc.p(length * Math.sin(rad), length * Math.cos(rad));
    },

    createTeam(prefab, count, range) {
        if(typeof prefab == 'string') {
            cc.loader.loadRes('fishes/' + prefab, (error, res) => {
                if(error) return;
                this.createTeamFromPrefab(res, count, range);
            })
        } else this.createTeamFromPrefab(prefab, count, range);
    },

    createTeamFromPrefab(prefab, count, range) {
        this.node.removeAllChildren();
        if(range) {
            count--;
            var node = cc.instantiate(prefab);
            node.x = node.y = 0;
            node.parent = this.node;
            for(var i = 0; i < count; i++) {
                var node = cc.instantiate(prefab);
                node.position = this.getOffset(i / count, range);
                node.parent = this.node;
            }
        } else {
            var start = -count / 2;
            for(var i = 0; i < count; i++) {
                var node = cc.instantiate(prefab);
                node.parent = this.node;
                node.y = 0;
                node.x = (start + i) * 150;
            }
        }
    },

    getTeamOffsets() {
        var ret = [];
        for(var i in this.node.children) {
            var pos = this.node.children[i].position;
            ret.push(cc.p(Math.decimal(pos.x, 4), Math.decimal(pos.y, 4)));
        }
        return ret;
    }
});
