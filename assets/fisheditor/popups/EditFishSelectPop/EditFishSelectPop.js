const FishName = [
    'fish_xiaoguangyu',
    'fish_cheqiyu',
    'fish_fangyu',
    'fish_hetun',
    'fish_wuzei',
    'fish_xiaochouyu',
    'fish_shuimu',
    'fish_haigui',
    'fish_hudieyu',
    'fish_dinianyu',
    'fish_denglongyu',
    'fish_jianyu',
    'fish_beikeyu',
    'fish_bianyu',
    'fish_moguiyu',
    'fish_shayu',
    'fish_daheisha',
    'fish_jinjianyu',
    'fish_jinbeikeyu',
    'fish_yinshayu',
    'fish_jinbianyu',
    'fish_jinmoguiyu',
    'fish_jinshayu',
    'fish_jinshuimu',
    'fish_leiyinlong',
    'fish_jinhaigui',
    'fish_jinhama',
    'fish_xiaosanyuan',
    'fish_xiaosiyuan',
    'fish_zhuanpanyu1',
    'fish_zhuanpanyu2',
    'fish_zhangyuhaiguai',
    'fish_huangjinzhangyu',
    'fish_haidaochuan',
    'fish_shenhaijulong',
    'fish_yuangujulong',
    'fish_qilinjushou',
    'fish_sunwukong',
    'fish_dianman',
    'fish_laohujiyu',
    'fish_nezha',
    'fish_casinofish',
    'fish_huafei'
]

cc.Class({
    extends: cc.Component,

    properties: {
        container: cc.Node,
        selectItem: cc.Node,
    },

    onLoad() {
        this.isClicked = false;
        this.selectItem.parent = null;
        cc.loader.loadResDir('fishes', null, (error, assets) => {
            if (error) {
                noCbk && noCbk(error);
                return cc.Toast(error).show();
            }
            for (var i in assets) {
                var node = cc.instantiate(this.selectItem);
                var item = node.getComponent('EditFishSelectItem');
                item.init(assets[i], this.container);
                node.on('click', this.onItemClick, this);
            }
        });
    },

    onItemClick(evt) {
        if (this.isClicked) return;
        this.node.emit('close', evt.target.children[0].name);
    }
});
