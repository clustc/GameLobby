
cc.Class({
    extends: cc.Component,

    properties: {
        userName: cc.EditBox,
        userPhone: cc.EditBox,
        userAddr: cc.EditBox,
    },

    onLoad() {

    },


    checkEditBox() {
        var userNameString = this.userName.string;
        if (userNameString.length === 0) {
            cc.Toast('请填写姓名').show();
            return false;
        }

        var phoneString = this.userPhone.string;
        if (phoneString.length === 0) {
            cc.Toast('请填写手机号').show();
            return false;
        }

        var regex = /^1[0-9]\d{9}$/;
        if (regex.test(phoneString) === false) {
            cc.Toast('请填写正确的手机号').show();
            return false;
        }

        var userAddrString = this.userAddr.string;
        if (userAddrString.length === 0) {
            cc.Toast('请填写收货地址').show();
            return false;
        }

        return true;
    },

    onConfirmClicked(event) {
        if (!this.checkEditBox()) { return; }
        cc.Proxy('updateUserInfo', this.userAddr.string, this.userName.string, this.userPhone.string).listen('RES_MODIFY_USER_RECEIVE_INFO').called(event => {
            cc.Toast('修改收获信息成功!').show();
            this.node.emit('close', 'true');
        }, event => {
            cc.Toast('修改收获信息失败,请重试!').show();
        });
    },
});
