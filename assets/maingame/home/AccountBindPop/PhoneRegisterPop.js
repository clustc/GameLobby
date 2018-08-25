const CCGlobal = require('CCGlobal');
cc.Class({
    extends: cc.Component,

    properties: {
        phoneNumber: cc.EditBox,
        password: cc.EditBox,
        code: cc.EditBox,
        confirmpassword : cc.EditBox,
        inviteCodeInput:cc.EditBox,
        smsCodeLable:cc.Label,
        smsCodeBtn:cc.Button,
    },


    onLoad() {
        this.timeIndex = 0;
        this.scene = cc.director.currentScene;
    },

    checkEditBox() {
        var phoneString = this.phoneNumber.string;
        if (phoneString.length === 0) {
            cc.Toast('请填写手机号').show();
            return false;
        }

        var regex = /^1[0-9]\d{9}$/;
        if (regex.test(phoneString) === false) {
            cc.Toast('请填写正确的手机号').show();
            return false;
        }


        var passwordString = this.password.string;
        if (passwordString.length === 0) {
            cc.Toast('请填写密码').show();
            return false;
        }

        var regex2 = /^[a-zA-Z0-9_]{6,16}$/;
        if (regex2.test(passwordString) === false) {
            cc.Toast('密码只可包含大小写字母数字及下划线，且密码不能小于6位').show();
            return false;
        }
        
        if (passwordString != this.confirmpassword.string){
            cc.Toast('两次输入的密码不一致').show();
            return;
        }
        var codeString = this.code.string;
        if (codeString.length === 0) {
            cc.Toast('请填写验证码').show();
            return false;
        }

        var agentCode = this.inviteCodeInput.string;
        if (agentCode.length === 0) {
            cc.Toast('请填写邀请码').show();
            return false;
        }

        return true;
    },
    photoEditDidChanged:function(text,editbox) {
        if (editbox == this.phoneNumber){
            var phone = this.phoneNumber.string;
            if (phone.length > 11){
                cc.Toast('手机号长度不能大于11位').show();
                this.phoneNumber.string = phone.substring(0,11);
            }
        }else{
            var smsCode = this.code.string;
            if (smsCode.length > 6){
                cc.Toast('验证码不能大于6位').show();
                this.code.string = smsCode.substring(0,6);
            }
        }
        
    },
    onVerifyCodeClicked(event) {
        var regex = /^1[0-9]\d{9}$/;
        if (regex.test(this.phoneNumber.string) === false) {
            cc.Toast('请填写正确的手机号').show();
            return;
        }

        // if (this.scene === 'LoginScene') {
        //     /*登陆页-账号登陆-手机注册-发送验证码*/
        //     ff.BuryingPoint(3400010101);
        // }
        cc.Linker('SmsRegisterVerifyCode',{username:this.phoneNumber.string}).request(data=>{
            cc.Toast('验证码发送成功，请注意查看').show();
            //开始60s倒计时
            this.smsCodeBtn.interactable = false;
            this.schedule(this.updateBtnLabel,1);;
        });
        // cc.Proxy('sendRegisitCode', this.phoneNumber.string).listen('RES_SEND_REGISIT_CODE').called(event => {
        //     cc.Toast('验证码发送成功，请注意查看').show();
        // }, (event) => {
        //     cc.Toast(event.detail).show();
        // });
    },
    updateBtnLabel:function(){
        this.timeIndex ++;
        if(this.timeIndex > 60){
            this.unschedule(this.updateBtnLabel);
            this.timeIndex = 0;
            this.smsCodeLable.string = '发送验证码';
            this.smsCodeBtn.interactable = true;
            return;
        }
        this.smsCodeLable.string = '发送验证码('+(60-this.timeIndex)+')';
    },
    onRegistClicked(event) {
        if (!this.checkEditBox()) { return; }
        // if (this.scene === 'LoginScene') {
        //     /*登陆页-账号登陆-手机注册-账号注册*/
        //     ff.BuryingPoint(3400010102);
        // } else {
        //     /*首页-绑定账号-立即注册*/
        //     ff.BuryingPoint(3401050004);
        // }
        cc.Linker('RegisterAccount',{smsCode:this.code.string,
                                    username:this.phoneNumber.string,
                                    password:this.password.string,
                                    deviceId:CCGlobal.deviceId,
                                    agentCode:this.inviteCodeInput.string}).request(data=>{
            cc.Linker('AccessToken',{token:data,type:1}).request(data=>{
                this.node.emit('close');
                CCGlobal.accessToken = data.accessToken;
                if (this.scene === 'HomeScene') {
                    var showData = [{ propId: 1, propNumAdd: 20 }];
                    ff.PopupManager.showAwardTips(showData, () => {
                        cc.Toast('绑定成功').show();
                        ff.AccountManager.onGetToken(data, null, 'isLoading');
                    });
                }else{
                    ff.GameManager.onGetToken(data);
                }
                
            });
        });
        // cc.Proxy('regisit', this.phoneNumber.string, this.password.string, this.code.string).listen('RES_REGISIT').called(event => {
        //     var data = event.detail;
        //     this.node.emit('close');
        //     if (this.scene === 'HomeScene') {
        //         var showData = [{ propId: 1, propNumAdd: 20 }];
        //         ff.PopupManager.showAwardTips(showData, () => {
        //             cc.Toast('绑定成功').show();
        //             ff.AccountManager.onGetToken(data, null, 'isLoading');
        //         });
        //     }
        //     else ff.GameManager.onGetToken(data);
        // }, event => {
        //     cc.Toast(event.detail).show();
        // });
    },

});
