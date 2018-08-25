const CCGlobal = require('CCGlobal');

const persistNodeUrl = [
    'prefab/ConstAssets/ConstAssets',
    'prefab/ccpopup/CCPopup',
    'prefab/cctoast/CCToast',
    'prefab/cctransfer/CCTransfer',
    'prefab/ccwaiting/CCWaiting',
]

var TOTAL_PERSISTNODE_NUM = persistNodeUrl.length;

cc.Class({
    extends: cc.Canvas,

    properties: {
        persistNodes: [cc.Prefab],
    },

    onLoad() {
        if(CC_EDITOR) return;
        var device = cc.view.getFrameSize();
        var design = this.designResolution;
        /**保证宽度不变 */
        design.height = device.height / device.width * design.width;
        this.designResolution = design;
        cc.screenBoundingBox = new cc.Rect(0, 0, design.width, design.height);
        cc.screenBoundingBox.center = cc.p(0, 0);
    },

    addPersistNodes() {
        this.node.emit('start_load_persist_node');
        if(!CCGlobal.persistNodeAdded){
            let self = this;
            for(let i in persistNodeUrl) {
                let uri = persistNodeUrl[i];
                cc.loader.loadRes(uri, (error, prefab)=>{
                    if(error){
                        cc.log(error);
                    }else{
                        let node = cc.instantiate(prefab);
                        node.parent = this.node.parent;
                        cc.game.addPersistRootNode(node);
                    }
                    self.onePersistNodeAdded();
                });
            }
        }else{
            this.node.emit('end_load_persist_node');
        }
    },

    onePersistNodeAdded(){
        if(--TOTAL_PERSISTNODE_NUM == 0){
            CCGlobal.persistNodeAdded = true;
            this.node.emit('end_load_persist_node');
        }
    },

    setSceneMusic(name) {
        this._sceneMusic = name;
    },

    onEnable() {
        this._sceneMusic && cc.Sound.playMusic(this._sceneMusic);
        cc.director.currentScene = this.node.name;
    },

    onDisable() {
        cc.Sound.stopAll();
        this._sceneMusic && cc.Sound.stopMusic(this._sceneMusic);
    }

});
