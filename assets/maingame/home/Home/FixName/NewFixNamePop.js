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
        userNameText:cc.EditBox,
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    
    userNameEditChanged:function() {
        var len = function(string){
            var len = 0;  
            for (var i=0; i<string.length; i++) {  
              if (string.charCodeAt(i)>127 || string.charCodeAt(i)==94) {  
                 len += 2;  
               } else {  
                 len ++;  
               }  
             }  
            return len;  
        };
        var name = this.userNameText.string;
        
        if (len(name) > 7){
            cc.Toast('昵称长度不能超过7位').show();
            this.userNameText.string = name.substring(0,7);
        }
    },
    submitAction:function(){
        cc.Linker('FixUserName',{nickname:this.userNameText.string}).request(data=>{
            cc.Toast('修改成功').show();
            this.node.emit('close');
            ff.AccountManager.userName = this.userNameText.string;
            ff.AccountManager.nicknameFlag = false;
            ff.AccountManager.emit('EVENT_USERINFO_CHANGE');
        });
    },
    
    start () {

    },

    // update (dt) {},
});
