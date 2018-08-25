cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: cc.Prefab,
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    onLoad() {
        this.itemContainer = this.node.getChildByName('item_container');
        this.scheduleOnce(() => { this.node.emit('close'); }, 3);
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    UpdatePop(data) {
        var length = data.length;
        this.itemContainer.width = Math.min(3, length) * this.itemContainer.width;

        for (var i in data) {

            var prop = data[i];
            var item = cc.instantiate(this.itemPrefab);

            var lbl = item.find('node_item/lbl_count').getComponent(cc.Label);
            if (prop.propNumAdd) {
                lbl.string = '×' + prop.propNumAdd;
            }
            else {
                lbl.string = prop.propDesc;
            }


            var spt = item.find('node_item/spt_icon').getComponent(cc.Sprite);
            if (prop.propId === 17 || prop.propId === 18) {
                spt.spriteFrame = ff.ConstAssets.propImages["activity"];
            }else
            {
                spt.spriteFrame = ff.AccountManager.propsConfig.getPropById(prop.propId).spriteFrame;
            }

            this.itemContainer.addChild(item);

            var ani = item.getComponent(cc.Animation);
            ani.play('clip_1');

            var clip_1 = ani.getAnimationState('clip_1');
            clip_1.on('finished', this.OnClip1Finished, ani);

            item.active = true;
        }
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    OnClip1Finished(event) {
        this.play('clip_2');
    }

});
