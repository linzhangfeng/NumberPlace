var PopUpBaseLayer = cc.Layer.extend({
	ctor:function(tag){
		this._super();
		this.setTag(tag);
		this.initBaseData();
	},
	initBaseData:function(){
		this.initMask();
	},
	//初始化遮罩
	initMask: function () {
		var layer = this.mask = new cc.LayerColor(cc.color(0, 0, 0, 80),winSize.width,winSize.height);
		this.addChild(layer);
	},
	//设置遮罩
	setMask:function(){
		var layer = new cc.LayerColor(cc.color(0, 0, 0, 80),winSize.width,winSize.height);
		this.addChild(layer);
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