cc.Class({
    extends: cc.Component,

    properties: {
        phoneNumber : cc.EditBox,
        password : cc.EditBox,
        code : cc.EditBox,
        confirmpass:cc.EditBox,
        smsCodeLable:cc.Label,
        smsCodeBtn:cc.Button,
    },

    onLoad:function(){
        this.timeIndex = 0;
    },
    checkEditBox () {
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

        if (this.confirmpass.string != passwordString){
            cc.Toast('两次填写的密码不一致').show();
            return false;
        }
        var codeString = this.code.string;
        if (codeString.length === 0) {
            cc.Toast('请填写验证码').show();
            return false;
        }

        return true;
    },
    photoEditDidChanged:function(text,editbox) {
        // var node = evt.target.getcomponent(cc.EditBox);
        
        if (editbox == this.phoneNumber){
            var phone = this.phoneNumber.string;
            if (phone.length > 11){
                cc.Toast('手机号长度不能大于11位').show();
                this.phoneNumber.string = phone.substring(0,11);
            }
        }else{
            var smscode = this.code.string;
            if (smscode.length > 6){
                cc.Toast('验证码不能大于6位').show();
                this.code.string = smscode.substring(0,6);
            }
        }
        
    },
    onVerifyCodeClicked(event) {
        var regex = /^1[0-9]\d{9}$/;
        if (regex.test(this.phoneNumber.string) === false) {
            cc.Toast('请填写正确的手机号').show();
            return;
        }
        cc.Linker('SmsForgetVerifyCode',{username:this.phoneNumber.string}).request(data=>{
            cc.Toast('验证码发送成功，请注意查看').show();
            this.smsCodeBtn.interactable = false;
            this.schedule(this.updateBtnLabel,1);;
        });
        // cc.Proxy('sendUpdatePswCode',this.phoneNumber.string).listen('RES_SEND_MODIFY_PASSWORD_CODE').called(event => {
        //     cc.Toast('验证码发送成功，请注意查看').show();
        // },event =>{
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
    onConfirmClicked(event) {
        if (!this.checkEditBox()) { return; }
        cc.Linker('ResetPassWord',{smsCode:this.code.string,username:this.phoneNumber.string,newPassword:this.password.string}).request(data=>{
            cc.Popup.clearPopups();
            // cc.sys.localStorage.removeItem('refreshToken');
            // require('CCGlobal').accessToken = '';
            cc.Toast('修改密码成功').show();
            // cc.director.loadScene('LoginScene');
            cc.Proxy('exit').called();
        });
        // cc.Proxy('updatePsw',this.phoneNumber.string,this.password.string,this.code.string).listen('RES_MODIFY_PASSWORD').called(event => {
        //     this.node.emit('close');
        //     cc.Toast('修改密码成功').show();
        // },event =>{
        //     cc.Toast(event.detail).show();
        // });
    }

});
