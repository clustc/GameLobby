
const CCGlobal = require('CCGlobal');
cc.Class({
    extends: cc.Component,

    properties: {
        phoneNumber: cc.EditBox,
        password: cc.EditBox,

        errTip: cc.Node,
    },

    onLoad() {
        this.errTip.active = false;
        var data = JSON.parse(cc.sys.localStorage.getItem('bind_account'));
        if (data != null){
            this.phoneNumber.string = data.phone;
            this.password.string = data.password;
            cc.sys.localStorage.removeItem('bind_account');
        }
    },

    onLogin () {
        /*登陆页-账号登陆-确定登陆*/
        var phone = this.phoneNumber.string;
        var password = this.password.string;
        if(!phone) {
            cc.Toast('帐号不能为空').show();
            return;
        }

        var regex = /^1[0-9]\d{9}$/;
        if (regex.test(phone) === false) {
            cc.Toast('请填写正确的手机号').show();
            return false;
        }

        if (!password) {
            cc.Toast('密码不能为空').show();
            return;
        }

        cc.Linker('GamePhoneLogin',{username:phone,password:password,deviceId:CCGlobal.deviceId}).request(data=>{
            cc.log('phone data  '+JSON.stringify(data));
            cc.Linker('AccessToken',{token:data,type:1}).request(data=>{
                cc.sys.localStorage.setItem('refreshToken', data.refreshToken);
                this.node.emit('close');
                ff.GameManager.onGetToken(data);
            });
            // ff.GameManager.onGetToken({accessToken:data});
            // ff.GameManager.onGetToken(event.detail);
        });
        // cc.Proxy('phoneLogin', phone, password).listen('RES_PHONE_LOGIN').called(event => {
        //     this.node.emit('close');
        //     ff.GameManager.onGetToken(event.detail);
        // },event =>{
        //     cc.Toast(event.detail).show();  
        // });
    },
    photoEditDidChanged:function() {
        var phone = this.phoneNumber.string;
        if (phone.length > 11){
            cc.Toast('手机号长度不能大于11位').show();
            this.phoneNumber.string = phone.substring(0,11);
        }
    },
    onPhoneRegister () {
        /*登陆页-账号登陆-手机注册*/
        this.node.emit('close');
        cc.Popup('PhoneRegisterPop').outsideClose(false).show()
    },

    onChangePassword () {
        /*登陆页-账号登陆-忘记密码*/
        this.node.emit('close');
        cc.Popup('AccountForgetPasswordPop').outsideClose(false).show()
    }

});
