const FishAnimPrefabs = {};
const FishInfo = require('FishData').FishInfo;
cc.Class({
    extends: cc.Component,

    properties: {
        propImages: [cc.SpriteFrame],
        skinImages: [cc.SpriteFrame],
        fishNameImages: [cc.SpriteFrame],
        headImages:[cc.SpriteFrame],
        headFrames:[cc.SpriteFrame],
    },
    
    onLoad() {
        ff.ConstAssets = this;
        this.propImages = this.parseToMap(this.propImages);
        this.skinImages = this.parseToMap(this.skinImages);
        this.fishNameImages = this.parseToMap(this.fishNameImages);
    },
    sayHello:function(){
        cc.log('hello');
    },
    parseToMap(array) {
        var images = {};
        for (var i in array) images[array[i].name] = array[i];
        return images;
    },

    loadFishValues(okCbk, noCbk) {
        cc.Linker('GetFishConfig').request(data => {
            data = data.fish;
            for (var i in data) {
                var d = data[i];
                var info = FishInfo[d.name];
                info && (info.value = d.score);
            }
            okCbk && okCbk();
        }, error => { noCbk && noCbk(error) });
    },

    loadFishAnims(progressCbk,okCbk, noCbk) {
        cc.loader.loadResDir('fishes', null,(completedCount,totalCount,item)=>{
            progressCbk && progressCbk(completedCount,totalCount,item);
        }, (error, assets) => {
            if (error) {
                noCbk && noCbk(error);
                return cc.Toast(error).show();
            }
            for (var i in assets) FishAnimPrefabs[assets[i].name] = assets[i];
            okCbk && okCbk();
        });
    },

    produceFishAnim(name) {
        return cc.instantiate(FishAnimPrefabs[name]);
    },

    getCannonSkin(skinId, level) {
        if(skinId === 0) {
            return this.skinImages['gun' + ff.AccountManager.cannonConfig.getCannonCount(level)];
        } else if (skinId < 1000) {
            return this.skinImages['vip' + skinId];
        } else {
            return this.skinImages['noble'];
        }
    },

    getCannonName(skinId) {
        if(skinId === 0) {
            return this.skinImages['gun_name'];
        } else if (skinId < 1000) {
            return this.skinImages['vip_name_' + skinId];
        } else {
            return this.skinImages['noble_name'];
        }
    }

});
