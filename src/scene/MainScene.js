var MainLayer=cc.Layer.extend({
	ctor:function(){
		this._super();
		this.init();
	},
	init:function(){
		var winSize = cc.director.getVisibleSize();

		var bgSprite=new cc.Sprite(res.Bg_Main_Png);
		bgSprite.setPosition(winSize.width*0.5,winSize.height*0.5);
		this.addChild(bgSprite);
		this._size = bgSprite;
		this._bg = bgSprite;
		
		var titleSp=new cc.Sprite(res.index_title_png);
		this.addChild(titleSp);
		titleSp.x = winSize.width / 2;
		titleSp.y = winSize.height*13 / 16;

		this.initGamePlayButton();

		return true;
	},
	initGamePlayButton: function () {
		var arrImage = [
			["res/btn_green_a.png",	"res/btn_green_b.png",	"res/btn_cn.png"],
			["res/btn_red_a.png",		"res/btn_red_b.png",		"res/btn_gs.png"],
			["res/btn_blue_a.png",	"res/btn_blue_b.png",		"res/btn_ds.png"]
		];

		for(var i = 0;i < MainLayer.ButtonSum;i++){
			var arr = arrImage[i];
			var button = new ccui.Button(arr[0],arr[1]);
			button.setTouchEnabled(true);
			button.setPressedActionEnabled(true);
			button.addTouchEventListener(this.onGamePlayButtonTouch,this);
			button.setTag(GameConfig.GameList.StartIndex + i);
			var y = utils.getPositionYbyCentrePos(this._size.height*0.5,i,MainLayer.ButtonSum,this._size.height*0.15);
			button.setPosition(this._size.width*0.5,y);
			this._bg.addChild(button);

			var buttonSp = new cc.Sprite(arr[2]);
			buttonSp.setNormalizedPosition(0.5,0.5);
			button.addChild(buttonSp,100);
		}
	},
	onGamePlayButtonTouch: function (sender, type) {
		if(type==ccui.Widget.TOUCH_ENDED) {
			var tag = sender.getTag();
			sender.setTouchEnabled(false);
			cc.director.runScene(new GameScene(tag));
		}
	},
});
MainLayer.ButtonSum = 3;
var MainScene=function(){
	var scene=new cc.Scene();
	var layer=new MainLayer();
	scene.addChild(layer);
	return scene;
}