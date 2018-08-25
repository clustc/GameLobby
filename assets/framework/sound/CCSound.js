require('CCGlobal');

cc.Sound = (function() {

    var musicIds = {};
    var musicVol = cc.sys.localStorage.getItem('musicVol') || '1';
    var soundVol = cc.sys.localStorage.getItem('soundVol') || '1';
    musicVol = parseFloat(musicVol);
    soundVol = parseFloat(soundVol);

    return {

        playSound(name) {
            var effect = cc.sys.localStorage.getItem('LobbyEffect');
            effect = parseInt(effect);
            if (effect == 0) return;
            cc.loadRes('sounds/' + name, audio => {
                cc.audioEngine.play(audio, false, soundVol);
            });
        },
    
        playMusic(name, loop) {
            loop === undefined && (loop = true);
            if (musicIds[name] !== undefined) cc.audioEngine.stop(musicIds[name]);
            cc.loadRes('sounds/' + name, audio => {
                musicIds[name] = cc.audioEngine.play(audio, loop, musicVol);
            });
        },

        stopMusic(name) {
            if (musicIds[name] !== undefined) cc.audioEngine.stop(musicIds[name]);
            delete musicIds[name];
        },
        

        stopAll() {
            cc.audioEngine.stopAll();
            for(var id in musicIds) delete musicIds[id];
        },

        setMusicVol(value) {
            musicVol = value;
            for (var name in musicIds) cc.audioEngine.setVolume(musicIds[name], value);
            cc.sys.localStorage.setItem('musicVol', musicVol);
        },

        setSoundVol(value) {
            soundVol = value;
            cc.sys.localStorage.setItem('soundVol', soundVol);
        },

        getMusicVol() {
            return musicVol;
        },

        getSoundVol() {
            return soundVol;
        },

        
    }
})();
