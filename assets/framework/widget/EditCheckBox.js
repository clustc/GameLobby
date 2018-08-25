const InputType = cc.Enum({
    USERNAME: 0,
    PHONE_CODE: -1,
    PHONE_NUMBER: -1,
    PASSWORD: -1,
    ADDRESS: -1,
});

cc.Class({
    extends: cc.Component,

    properties: {
        inputType: {
            type: InputType,
            default: InputType.USERNAME
        }
    },

    onLoad() {
        this.editBox = this.node.getComponent(cc.EditBox);
    },

    start() {

    },
});
