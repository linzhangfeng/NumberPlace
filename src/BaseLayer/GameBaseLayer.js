var GameBaseLayer = cc.Layer.extend({
	ctor:function(tag){
		this._super();
		this.setTag(tag);
		this.initBaseData();
	},
	initBaseData:function(){
		this.initBackBtn();
	},
	initBackBtn:function(){
		var name = frameRes.Ui_Back_Png;

		var backButton = new ccui.Button();
		backButton.setTouchEnabled(true);
		backButton.setPressedActionEnabled(true);
		backButton.loadTextures(name,name,"");
		backButton.addTouchEventListener(this.onBack,this);

		backButton.setPosition(winSize.width*0.1,winSize.height*0.88);
		this.addChild(backButton,GameConfig.ZOrder.Ui_Button);
	},
	onBack: function(sender, type){	
		if(type==ccui.Widget.TOUCH_ENDED){
			cc.director.runScene(new MainScene());
		}
	},
	initRefreshBtn:function(){
		var size = cc.director.getVisibleSize();
		var backButton = new ccui.Button();
		backButton.setTouchEnabled(true);
		backButton.setPressedActionEnabled(true);
		backButton.loadTextures(frameRes.Ui_Refresh_Png,frameRes.Ui_Refresh_Png,"");
		backButton.addTouchEventListener(this.onRefesh,this);
		backButton.setPosition(size.width*0.85,this._height);
		this.addChild(backButton,GameConfig.MENU_ZODER.MENU_UI);
	},
	onRefesh: function(sender, type){	
		if(type==ccui.Widget.TOUCH_ENDED){
			var isPay = PayLevel.isPay(this.getTag());
			if((!isPay)){
				cc.director.replaceScene(new MainScene());
			}else{
				cc.director.replaceScene(new GameScene(this.getTag()));
			}
		}
	},
	onEnter:function(){
		this._super();
	},
	onExit:function(){
		this._super();
	},
	//添加触摸监听s
	initListener:function(){
		this.listener = cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan,
			onTouchMoved: this.onTouchMoved,
			onTouchEnded: this.onTouchEnded,
		}, this);
	},
	onTouchBegan : function(touch, event){
		var target = event.getCurrentTarget();
		var touchPos = touch.getLocation();
		return true;
	},
	onTouchMoved : function(touch, event){
		var target = event.getCurrentTarget();
		var touchPos = touch.getLocation();
	},
	onTouchEnded : function(touch, event){
		var target = event.getCurrentTarget();
		var touchPos = touch.getLocation();
	},
});