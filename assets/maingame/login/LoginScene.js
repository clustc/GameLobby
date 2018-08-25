const CCGlobal = require('CCGlobal');

var cachedata = null;
(function(){
    if(typeof CacheData != 'undefined'){
        cachedata = CacheData.getInstance();
    };
})();

cc.Class({
    extends: cc.Component,

    properties: {
        btnQuick: cc.Node,
        btnPhone: cc.Node,
        btnRegister: cc.Node,
        labelVersion: cc.Label,
        lblTip:cc.Label,
        loadingBar : cc.Node,

        liuguangQuick : cc.Node,
        liuguangPhone : cc.Node,

        bUpdateDone:{
            default:false,
            visible:false,
        },

        bPersistNodeLoadDone:{
            default:false,
            visible:false,
        }
    },

    onLoad() {
        
        // cc.Transfer.hide();
        
        this.node.on('start_load_persist_node', this.onStartLoadPersistNode, this);
        this.node.on('end_load_persist_node', this.onEndLoadPersistNode, this);

        this.node.getComponent(cc.Canvas).addPersistNodes();

        this.node.on('update_version', this.onUpdateLocalVersion, this);
        this.node.on('update_check', this.onCheckUpdate, this);
        this.node.on('update_start', this.onUpdateBegin, this);
        this.node.on('update-skip', this.onUpdateSkip, this);
        this.node.on('update-progress', this.onUpdateProgress, this);
        this.node.on('update-finish', this.onUpdateFinish, this);


        var isOpen = cc.sys.localStorage.getItem('LobbyBgMusic');
        this.node.getComponent(cc.Canvas).setSceneMusic('lobbyBg');
        if (isOpen == null){
            cc.Sound.setMusicVol(1);
        }else{
            isOpen = parseInt(isOpen);
            if (isOpen == 1){
                cc.Sound.setMusicVol(1);
            }else{
                cc.Sound.setMusicVol(0);
            }
        }
    },

    /**
     * 刷新本地版本号
     */
    onUpdateLocalVersion:function(event){
        let version = event.detail;
        this.labelVersion.string = version;
    },

    /**
     * 检测更新 
     */
    onCheckUpdate:function(){
        this.showLoading(true);
        this.showTip("更新检测");
    },

    /**
     * 开始更新
     */
    onUpdateBegin:function(){
        this.showTip('检测到新版本,开始更新');
    },

    
    /**
     * 刷新更新进度
     * @param {*} event 
     */
    onUpdateProgress(event){
        // event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
        let evt = event.detail;
        let downloaded = (evt.getDownloadedBytes()/(1024*1024)).toFixed(2);
        let total = (evt.getTotalBytes()/(1024*1024)).toFixed(2);
        
        if(total<0.1){
            //如果跟新包体积过小，则按下载文件数量百分比显示
            this.showTip('文件' + evt.getDownloadedFiles() + '/' + evt.getTotalFiles());
            this.setProgress(evt.getPercentByFile());
        }else{
            this.showTip( downloaded + "MB/"+total+"MB");
            this.setProgress(evt.getPercent());
        }
    },

    /**
     * 更新成功，需重启
     */
    onUpdateFinish(){
        this.setProgress(1);
        this.showTip("更新完成");

        if(cachedata){
            cachedata.set("updated", "true");
            
            cachedata.set('loadPath', )
        }

        this.scheduleOnce(()=>{

            cc.game.restart();
        }, 0.1);
    },

    showLoading:function(bShow){
        if(bShow){
            let loading = this.node.getChildByName("loading");
            loading.active = true;

            let circle = loading.getChildByName("circle");
            circle.runAction(cc.repeatForever(cc.rotateBy(2,360)));
        }else{
            let loading = this.node.getChildByName("loading");
            loading.active = false;

            let circle = loading.getChildByName("circle");
            circle.stopAllActions();
        }
    },

    showTip:function(content){
        this.lblTip.string = content;
    },

    setProgress(progress) {
        this.loadingBar.active = true;
        let comp = this.loadingBar.getComponent("LoadingBar");
        comp.progress = progress;
    },

    /**
     * 跳过更新
     */
    onUpdateSkip(){
        this.bUpdateDone = true;
        if(this.bPersistNodeLoadDone){
            this.toLogin();
        }
    },


    onStartLoadPersistNode(){

    },

    onEndLoadPersistNode(){
        this.bPersistNodeLoadDone = true;
        if(this.bUpdateDone){
            this.toLogin();
        }
    },

    /**
     * 显示登录
     */
    toLogin:function(){
        this.btnQuick.active = true;
        this.btnPhone.active = true;
        this.btnRegister.active = true;
        this.liuguangQuick.active = true; 
        this.liuguangPhone.active = true;

        this.showTip("");
        this.loadingBar.active = false;
        this.showLoading(false);

        this.btnQuick.on('click', this.onQuickClick, this);
        this.btnPhone.on('click', this.onPhoneLoginClick, this);
        this.btnRegister.on('click', this.registerPhone, this);
        this.node.on('token', (event)=>{
            alert(event.detail);
        }, this);
        cc.Linker('CheckVisitor',{source:1,visitorToken:CCGlobal.deviceId}).request(data=>{
            cc.log('CheckVisitor  '+JSON.stringify(data));
            if (data != 1){
                this.hideQuitBtn();
            }
        });

        var refreshToken = cc.sys.localStorage.getItem('refreshToken');
        cc.log('refreshToken    '+refreshToken);
        if (refreshToken){
            var button = this.btnQuick.getComponent(cc.Button);
            button.interactable = false;

            var button1 = this.btnPhone.getComponent(cc.Button);
            button1.interactable = false;

            cc.Linker('AccessToken',{token:refreshToken,type:2}).showLoading(true).request(data=>{
                CCGlobal.accessToken = data.accessToken;
                cc.sys.localStorage.setItem('refreshToken', data.refreshToken);
                ff.GameManager.onGetToken(data);
            },(msg,code)=>{
                var button = this.btnQuick.getComponent(cc.Button);
                button.interactable = true;

                var button1 = this.btnPhone.getComponent(cc.Button);
                button1.interactable = true;

                cc.Toast(msg).show();
            });
        }

    },

    hideQuitBtn:function(){
        this.btnQuick.active = false
        this.liuguangQuick.active = false;

        this.btnPhone.x = 0;
        this.liuguangPhone.x = -2;
    },  

    /**
     * 游客登录
     */
    onQuickClick() {
        
        cc.Linker('VisitorLogin',{source:1,visitorToken:CCGlobal.deviceId}).request(data=>{
            cc.Linker('AccessToken',{token:data,type:1}).request(data=>{
                this.node.emit('close');
                cc.sys.localStorage.setItem('refreshToken', data.refreshToken);
                CCGlobal.accessToken = data.accessToken;
                ff.GameManager.onGetToken(data);
            });
        });
    },

    /**
     * 手机登录
     */
    onPhoneLoginClick() {
        /*登陆页-账号登陆*/
        cc.Popup('AccountLoginPop').outsideClose(false).show();
    },

    /**
     * 注册账号
     */
    registerPhone:function(){
        cc.Popup('PhoneRegisterPop').outsideClose(false).show()
    },

    onWXClick() {
        /*登陆页-微信登陆*/
        cc.Proxy('wxLogin').listen('RES_WEI_XIN_LOGIN').called(event => {
            this.onGetToken(event.detail);
        }, event => {
            cc.Toast('微信登录失败，请重试!').show();
        });
    },

    onGetToken(data) {
        ff.GameManager.onGetToken(data);
    },

    checkAuditState() {
        cc.Linker('GetAuditInit').request((data) => {
            var isAudit = data == 1;
            CCGlobal.isAudit = isAudit;
            this.btnWX.active = !isAudit;
            this.btnPhone.active = !isAudit;
            if (this.btnWX.active && this.btnQuick.active) this.btnWX.children[0].getComponent(cc.Animation).play('WxBtnAnim');
        })
    },


});
