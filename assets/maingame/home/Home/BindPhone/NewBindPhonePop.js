// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        phoneNumber: cc.EditBox,
        smsCodeLable:cc.Label,
        smsCodeBtn:cc.Button,
        smsCode:cc.EditBox,
        passwrod:cc.EditBox,
        inviteCodeInput:cc.EditBox,
        confirmPassWord:cc.EditBox
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.timeIndex = 0;
    },
    initData:function(award){
        this.award = award;
    },
    phoneEditChange:function () {
        var phone = this.phoneNumber.string;
        if (phone.length > 11){
            cc.Toast('手机号长度不能大于11位').show();
            this.phoneNumber.string = phone.substring(0,11);
        }
    },
    onVerifyCodeClicked(event) {
        var regex = /^1[0-9]\d{9}$/;
        if (regex.test(this.phoneNumber.string) === false) {
            cc.Toast('请填写正确的手机号').show();
            return;
        }
        cc.Linker('SmsRegisterVerifyCode',{username:this.phoneNumber.string}).request(data=>{
            cc.Toast('验证码发送成功，请注意查看').show();
            //开始60s倒计时
            this.smsCodeBtn.interactable = false;
            this.schedule(this.updateBtnLabel,1);;
        });
        
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
        
        var phone = this.phoneNumber.string;
        var regex = /^1[0-9]\d{9}$/;
        if (regex.test(phone) === false) {
            cc.Toast('请填写正确的手机号').show();
            return;
        }

        var passwordString = this.passwrod.string;
        if (passwordString.length === 0) {
            cc.Toast('请填写密码').show();
            return false;
        }

        var regex2 = /^[a-zA-Z0-9_]{6,16}$/;
        if (regex2.test(passwordString) === false) {
            cc.Toast('密码只可包含大小写字母数字及下划线，且密码不能小于6位').show();
            return false;
        }
        
        if (passwordString != this.confirmPassWord.string){
            cc.Toast('两次输入的密码不一致').show();
            return;
        }

        var agentCode = this.inviteCodeInput.string;
        if (agentCode.length === 0) {
            cc.Toast('请填写邀请码').show();
            return false;
        }
       
        cc.Linker('RegisterAccount',{smsCode:this.smsCode.string,
                                    username:this.phoneNumber.string,
                                    password:passwordString,
                                    deviceId:require('CCGlobal').deviceId,
                                    visitorToken:require('CCGlobal').deviceId,
                                    agentCode:this.inviteCodeInput.string}).request(data=>{
            cc.Popup.clearPopups();
            // cc.sys.localStorage.removeItem('refreshToken');
            // require('CCGlobal').accessToken = '';
            cc.Toast('绑定成功,您将获得'+this.award+"金叶子奖励").show();
            // ff.AccountManager.emit('FIXUSERNAMEFINISHED'); 
            ff.AccountManager.emit('EVENT_USERINFO_CHANGE');
            // cc.director.loadScene('LoginScene');
            cc.sys.localStorage.setItem('bind_account', JSON.stringify({phone:this.phoneNumber.string,password:passwordString}));
            cc.Proxy('exit',).called();
        });
        
    },
    start () {

    },

    // update (dt) {},
});
