
var GameScene = cc.Scene.extend({
	_nLayerType:false,
	ctor:function(type,userData){
		this._super();
		this._nLayerType= type;
		this._userData = userData;
		//var layer = new GameTransitionLayer();
		//this._transitionLayer = layer;
		//this.addChild(layer,GameConfig.MENU_ZODER.MENU_LAYER);
	},

	onEnter:function(){ 
		this._super();

		//this.scheduleOnce(function(){
			var pLayer = this.initLayer();
		//	if(!pLayer){
		//		cc.error("current game id is not defined %d",this._nLayerType);
		//		return;
        //
		//	}
		//	pLayer.retain();
        //
		//	var rnd = utils.getRandom(1, 2);
		//	this.scheduleOnce(function(){
				this.addChild(pLayer);
				//this._transitionLayer.removeFromParent();
		//	},rnd/2);
		//},1.0)
	},
	onEixt:function(){
		this._super();
	},

	initLayer:function(){
		var pLayer;
		cc.log("====>initLayer="+this._nLayerType);
		switch(this._nLayerType){	
		case GameConfig.GameList.GamePlay1:
			pLayer = new GameLayer(this._nLayerType);
			break;
		case GameConfig.GameList.GamePlay2:
			pLayer = new GamePlaysLayer(this._nLayerType);
			break;
		case GameConfig.GameList.GamePlay3:
			pLayer = new GameNinePuzzleLayer(this._nLayerType);
			break;	
		}
		return pLayer;
	},
});