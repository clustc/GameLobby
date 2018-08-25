cc.Class({
    extends: cc.Component,

    properties: {
        prefab : cc.Prefab,
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    ctor () {
        this._map = new Map();
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    onDestroy () {
        this._map.clear();
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    Reg(type,node) {
        if (!node) {
            cc.error('reg node is null');
            return;
        }     

        var needAttach = true;
        if (this._map.has(type) === false) {
            this._map.set(type,new Array());
            this.node.on(type,this.OnHandleEvent,this);
        }
        else
        {
            this._map.get(type).forEach(existNode => {
                if (existNode === node) {
                    needAttach = false;
                    return true;
                }
            });
        }

        if (needAttach === true) {
            this._map.get(type).push(node);
        }
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    UnReg(type,node) {
        var nodeList = this._map.get(type);
        if (nodeList) {
            if (!node) {
                this._map.delete(type);
                return;
            }

            nodeList.forEach((existNode,index) => {
                if (existNode === node) {
                    nodeList.splice(index,1);
                }
            });

            if (nodeList.length === 0) {
                this._map.delete(type);
            }
        }
    },

    /*====================================================================================================
    /action: attach or detach
    /align:  TopLeft,TopRight,BottomLeft,BottomRight
    /offset: position offset
    /matchfunc: if exist before doAction this func will be called with ecah node will be param.
    /           return true match
    /           return undefined or false no match
    /====================================================================================================*/
    OnHandleEvent(event) {
        event.stopPropagation();
    
        var type = event.type;
        var detail = event.detail;

        var data = {
            action : detail.action,
            align : detail.align || 'TopRight',
            offset : detail.offset || cc.p(0.0),
            matchfunc : detail.matchfunc,
        };

        var nodeList = this._map.get(type);
        if (!nodeList) { return; }

        nodeList.forEach(node => {
            this.DoAction(node,data);
        });
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    DoAction(node,data) {
        if (data.matchfunc) {
            if (!data.matchfunc(node)) {
                return;
            }
        }

        if (data.action === 'attach') {
            this.Attach(node,data);
        }
        else if(data.action === 'detach'){
            this.Detach(node,data);
        }
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    Attach(node,data) {
        if (!node) {
            cc.error('node to be attached must not be null');
            return;
        }

        var prefab = node.getChildByName('_prefab_');
        if (!prefab) {
            var pf = cc.instantiate(this.prefab);
            pf.name = "_prefab_";
            
            var w = pf.getComponent(cc.Widget);
            if (!w) {
                w = pf.addComponent(cc.Widget)
            }

            w.top = w.bottom = w.left = w.right = 0;
            w.isAlignTop = w.isAlignBottom = w.isAlignLeft = w.isAlignRight = false;

            switch( data.align ){
                case 'TopRight':
                    w.isAlignTop = w.isAlignRight = true;
                    w.top = data.offset.y;
                    w.right = data.offset.x;
                    break;
                case 'TopLeft':
                    w.isAlignTop = w.isAlignLeft = true;
                    w.top = data.offset.y;
                    w.left = data.offset.x;
                    break;
                case 'BottomRight':
                    w.isAlignBottom = w.isAlignRight = true;
                    w.bottom = data.offset.y;
                    w.right = data.offset.x;
                    break;
                case 'BottomLeft':
                    w.isAlignBottom = w.isAlignLeft = true;
                    w.bottom = data.offset.y;
                    w.left = data.offset.x;
                    break;
            }

            node.addChild(pf);
        }
        else {
            if (prefab.active == false)  {
                prefab.active = true;
            }
        }
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    Detach(node,data) {
        if (!node) {
            cc.error('node to be detached is null')
            return;
        }

        var prefab = node.getChildByName('_prefab_');
        if (prefab) {
            prefab.active = false;
        }
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    HasAnyAttachShow(type) {
        var ret = true;
        var nodeList = this._map.get(type);
        if (!nodeList) {
            return ret;
        }

        for (var i = 0; i < nodeList.length; i++) {
            var node = nodeList[i];
            if (node) {
                var prefab = node.getChildByName('_prefab_');
                if (prefab && prefab.active === true){
                    ret = false;
                    break;
                }
            }
        }

        return ret;
    }

});
