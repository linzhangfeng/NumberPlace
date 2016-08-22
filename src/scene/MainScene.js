var MainScene=cc.Layer.extend({
	ctor:function(){
		this._super();
		this.init();
	},
	init:function(){
		this.loadGameStates();
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
		return;
		var btn1=new ButtonSprite("",res.btn_green_a_png,res.btn_green_b_png,this,this.onTouchBeganBack.bind(this),this.onTouchEndedBack.bind(this),0);
		btn1.x = winSize.width / 2;
		btn1.y = winSize.height *13/20;
		var sp01=new cc.Sprite(res.btn_cn_png);
		btn1.addChild(sp01);
		sp01.x=btn1.width/2;
		sp01.y=btn1.height/2;
		
		var btn2=new ButtonSprite("",res.btn_blue_a_png,res.btn_blue_b_png,this,this.onTouchBeganBack.bind(this),this.onTouchEndedBack.bind(this),1);
		btn2.x = btn1.x;
		btn2.y = btn1.y-btn1.height*3/2;
		var sp02=new cc.Sprite(res.btn_gs_png);
		btn2.addChild(sp02);
		sp02.x=btn2.width/2;
		sp02.y=btn2.height/2;
		
		var btn3=new ButtonSprite("",res.btn_red_a_png,res.btn_red_b_png,this,this.onTouchBeganBack.bind(this),this.onTouchEndedBack.bind(this),2);
		btn3.x = btn2.x;
		btn3.y = btn2.y-btn2.height*3/2;
		var sp03=new cc.Sprite(res.btn_ds_png);
		btn3.addChild(sp03);
		sp03.x=btn3.width/2;
		sp03.y=btn3.height/2;
		
		var x=btn1.x+btn1.width*7/10;
		var y=btn1.y;
		var menu1=this.getCourseMenu(x,y,0);

		y=btn2.y;
		var menu2=this.getCourseMenu(x,y,1);
		
		y=btn3.y;
		var menu3=this.getCourseMenu(x,y,2);

		//gamecenter
		var gameCenterSp=new ButtonSprite("",res.gamecenter_png,"",this,null,function(){
			if(cc.sys.isMobile){
				//显示GameCenter
				var ret = jsb.reflection.callStaticMethod("NativeOcClass","showLeaderboard");
			}else{
				cc.log("gameCenterSp~");
			}
		}.bind(this),0);
		gameCenterSp.y=btn1.y-btn1.height*3/4;
		gameCenterSp.x=btn1.x-btn1.width*7/8;
		gameCenterSp.setScaleXY(0.8);
		
		//音效
		var img=res.voice_open_png;
		if(GS.sound==0){
			img=res.voice_close_png;
		}
		var voiceSp=new ButtonSprite("",img,"",this,null,function(){
			if(GS.sound==0){
				GS.sound=1;
				voiceSp.setTexture(res.voice_open_png);
			}else{
				GS.sound=0;
				voiceSp.setTexture(res.voice_close_png);
			}
		}.bind(this),0);
		voiceSp.y=gameCenterSp.y-gameCenterSp.height*3/2;
		voiceSp.x=gameCenterSp.x;
		voiceSp.setScaleXY(0.8);
		
		var courseLayer=this.courseLayer=new CourseLayer();
		this.addChild(courseLayer);
		courseLayer.x=0;
		courseLayer.y=0;

		return true;
	},
	initGamePlayButton: function () {
		var arrImage = [
			["res/btn_green_a.png",	"res/btn_green_b.png",	"res/btn_cn.png"],
			["res/btn_red_a.png",		"res/btn_red_b.png",		"res/btn_gs.png"],
			["res/btn_blue_a.png",	"res/btn_blue_b.png",		"res/btn_ds.png"]
		];

		for(var i = 0;i < MainScene.ButtonSum;i++){
			var arr = arrImage[i];
			var button = new ccui.Button(arr[0],arr[1]);
			button.setTouchEnabled(true);
			button.setPressedActionEnabled(true);
			button.addTouchEventListener(this.onGamePlayButtonTouch,this);
			button.setTag(GameConfig.GameList.StartIndex + i);
			var y = utils.getPositionYbyCentrePos(this._size.height*0.5,i,MainScene.ButtonSum,this._size.height*0.15);
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
	/**获取查看攻略的按钮*/
	getCourseMenu:function(x,y,type){
		var courseBtn=new ButtonSprite("",res.gl_png,"",this,null,function(){
			this.courseLayer.show(type);
		}.bind(this),0);
		courseBtn.x = x;
		courseBtn.y = y;

		return courseBtn;
	},
	onTouchBeganBack:function(){},
	onTouchEndedBack:function(target){
		var flag=target.flag;
		GS.gameType=flag;
		//cc.director.runScene(new cc.TransitionFade(0.8,GameLayer.scene()));
		cc.director.runScene(GameLayer.scene());
	},
	/**加载存储的信息*/
	loadGameStates:function(){
		var r=GS.loadLocalStorage(GS.LocalStorageKey);
		if(r!=null&&r!=""){
			var json=JSON.parse(r);

			if(json.round!=undefined){
				GS.sound=json.round;
			}

			if(json.steps){
				GS.steps=json.steps;
			}
		}
	}
});
MainScene.ButtonSum = 3;
MainScene.scene=function(){
	var scene=new cc.Scene();
	var layer=new MainScene();
	scene.addChild(layer);
	return scene;
}