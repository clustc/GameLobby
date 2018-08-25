cc.Class({
    extends: cc.Component,

    properties: {
        nodeTab: {
            default: null,
            type: cc.Node,
            tooltip : "Tab集合的父节点",
        },

        nodeContent: {
            default: null,
            type: cc.Node,
            tooltip : "和Tab映射的Content节点集合的父节点",
        },
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    onLoad() {
        this._curTabIndex = 0;
        this._tabCount = this.nodeTab.childrenCount;
        this._contentCount = this.nodeContent.childrenCount;
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    start() {
        if (this.CheckUIConfig() === true) {
            this.UpdateView(true);
        }
    },

    /*====================================================================================================
    /bind index to tabs and contents,one index make sure one connection with a tab and a content
    /====================================================================================================*/
    BindIndex() {
        for (var i = 0; i < this._tabCount; i++) {
            var tab = this.nodeTab.children[i];
            tab.tabIndex = i;
            tab.on('click', this.OnTabClicked, this);
        }

        for (var i = 0; i < this._contentCount; i++) {
            var content = this.nodeContent.children[i]
            content.contentIndex = i;
        }
    },

    /*====================================================================================================
    /tab must have cc.Button component and tabCount must equal contentCount in static config 
    /====================================================================================================*/
    CheckUIConfig() {
        if (this._tabCount !== this._contentCount) {
            cc.error("tab count must equal content count.")
            return false;
        }

        for (var i = 0; i < this._tabCount; i++) {
            var tab = this.nodeTab.children[i];

            var btnComp = tab.getComponent(cc.Button);
            if (!btnComp) {
                cc.error(tab.name + "must have cc.Button comp.")
                return false; 
            }
        }

        return true;
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    UpdateContents() {
        for (var i = 0; i < this._contentCount; i++) {
            var content = this.nodeContent.children[i]
            if (content.contentIndex === this._curTabIndex) {
                content.active = true;
            }
            else{
                content.active = false;
            }
         }
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    UpdateTabs() {
        var tabCount = this.nodeTab.childrenCount;
        for (var i = 0; i < tabCount; i++){
            var tab = this.nodeTab.children[i];
            var btnComp = tab.getComponent('cc.Button')

            if (tab.tabIndex === this._curTabIndex) {
                btnComp.interactable = false;
            }
            else{
                btnComp.interactable = true;
            }
        }
    },

    /*====================================================================================================
    /update tableview just for the state of tab button and the visible of content
    /@bPackIndex => if need reset index binding or not.true need and false not
    /====================================================================================================*/
    UpdateView(bPackIndex) {
        if (bPackIndex === true) {
            this.BindIndex();
        }     
        this.UpdateTabs()
        this.UpdateContents()
    },    

    /*====================================================================================================
    /
    /====================================================================================================*/
    OnTabClicked(event) {
        var index = event.target.tabIndex;
        if (this._curTabIndex === index){
            return;
        }

        this._curTabIndex = index
        this.UpdateView()
    },

    /*====================================================================================================
    /dynamic insert tab and content
    /====================================================================================================*/
    AddTabAndContent(tab,content) {
        if (!tab || !content) {
            cc.error("tab or content undefined...")
            return;
        }

        if (!tab.getComponent(cc.Button)) {
            cc.error("must have cc.Button comp.")
            return;
        }

        this.nodeTab.addChild(tab);
        
        content.active = false;
        this.nodeContent.addChild(content);

        this.UpdateView(true);
    },

});
