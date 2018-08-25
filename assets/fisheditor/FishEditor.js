cc.Class({
    extends: cc.Component,

    properties: {
        newOne: cc.Node,
        newLine: cc.Node,
        newTeam: cc.Node,
        newShoal: cc.Node,
        allPath: cc.Node,
    },

    onLoad() {
        this.node.getComponent(cc.Canvas).addPersistNodes();
        this.newOne.on('click', () => this.onNewFish('EditPathInfoPop', 'single'));
        this.newLine.on('click', () => this.onNewFish('EditPathInfoPop', 'queue'));
        this.newTeam.on('click', () => this.onNewFish('EditPathInfoPop', 'border'));
        this.newShoal.on('click', () => {
            ff.Popup('EditShoalNamePop').show(null, data => {
                data && ff.Popup('EditNewShoalPop').show(pop => pop.init(data))
            })
        });
        this.allPath.on('click', () => ff.Popup('EditAllPathPop').show(null, item => {
            if(item) {
                if(item.info.name === 'fish_shoal') ff.Popup('EditNewShoalPop').show(pop => pop.init(item));
                else ff.Popup('EditPathInfoPop').show(pop => pop.editInfo(item.name, item.info), info => {
                    info && ff.Popup('EditNewPathPop').show(pop => pop.editPath(info, item.path))
                });
            }
        }));
        cc.Waiting.show();
        ff.ConstAssets.loadFishAnims(() => cc.Waiting.hide());
    },

    onNewFish(pop, type) {
        ff.Popup(pop).show(pop => {
            type && pop.init(type);
        }, data => {
            data && ff.Popup('EditNewPathPop').show(pop => pop.init(data))
        })
    },
});
