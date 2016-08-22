var GamePlaysLayer=GameBaseLayer.extend({
	centerLayer:null,//中间位置的layer
	gameState:0,//游戏状态：1为开始；2为结束、暂停；
	resultLayer:null,//显示结果的layer
	buttonSprite:null,//控制开始、查看、继续的按钮
	preUnit:null,//上一个选中的单元（设置为选中的颜色）
	step:0,//移动的步数
	lookNum:0,//查看次数
	ctor:function(games){
		this._super(games);
		this.init();
	},
	init:function(){
		/**加载plist文件*/
		cc.spriteFrameCache.addSpriteFrames(res.nums_plist);
		
		var bgSprite=new cc.Sprite(res.Bg_GamePlay_Jpg);
		bgSprite.setPosition(winSize.width*0.5,winSize.height*0.5);
		this.addChild(bgSprite);
		this._size = bgSprite.getContentSize();
		this._bg = bgSprite;　

		/**单元格子*/
		GamePlaysLayer.unitSpriteArray=[];
		/**移动时选中的单元格*/
		GamePlaysLayer.checkUnitArray=[];

		//初始化中间的布局
		this.initCenter();

		var layer = new GamePlaysInformationLayer(this.getTag());
		this.addChild(layer);


		this.showResultLayer();

		return;
		//初始化上方的layer
		this.initTopLayer();

		//初始化下方的layer
		this.initBelowLayer();

		//初始化战斗结果layer
		this.initResultLayer();
		//return;
		var num=0;
		var array=GamePlaysLayer.unitSpriteArray;
		for(var i=0;i<array.length;i++){
			var o=array[i];
			if(o.index!=o.index0&&o.index0!=8){
				num++;
			}
		}
		this.infoLabel.setString((8-num)+"/"+8);
		
		if (cc.sys.isMobile) {
			//创建横幅广告
			var ret = jsb.reflection.callStaticMethod("NativeOcClass","callNativeCreateBanner");
		}
                              
		return true;
	},
	showResultLayer: function () {
		var layer = new GamePlayResultLayer(this.getTag());
		this.addChild(layer,100);
	},
	/**初始化下方的layer*/
	initBelowLayer:function(){
		var belowLayer=this.belowLayer=new cc.LayerColor(cc.color(255, 255, 255, 1),this.centerLayer.width,(winSize.height-this.centerLayer.height)/4);
		this.addChild(belowLayer);
		belowLayer.x=(winSize.width-belowLayer.width)/2;
		belowLayer.y=belowLayer.height*7/8;
		
		var num=1/4;
		if(GS.gameType!=0){
			num=1/8;
			
			//查看按钮
			var btn=this.buttonSprite=new ButtonSprite("",res.btn_blue_a_png,"",belowLayer,this.onTouchBeganBack.bind(this),this.onTouchEndedBack.bind(this));

			btn.x=belowLayer.width/2;
			btn.y=belowLayer.height/2;
			var infoSprite=new cc.Sprite(res.start_png);
			btn.addChild(infoSprite);
			btn.infoSprite=infoSprite;
			infoSprite.x=btn.width/2;
			infoSprite.y=btn.height/2;

			var label=this.viewLabel=new cc.LabelTTF("(0/2)","Arial",30);
			label.setVisible(false);
			belowLayer.addChild(label);
			label.x=btn.x;
			label.y=btn.y-btn.height*4/5;
			label.color=cc.color(132,84,61,255);
		}
		
		//重新开始
		var btn2=new ButtonSprite("",res.refresh_png,"",belowLayer,null,function(){
			this.reStart();
		}.bind(this));
		btn2.x=belowLayer.width*(1-num);
        btn2.y=belowLayer.height/2;
        
        //返回首页
        var backBtn=new ButtonSprite("",res.home_png,"",belowLayer,null,function(){
        	//cc.director.runScene(new cc.TransitionFade(0.4,new SysMenu.scene()));
           
        	if(cc.sys.isMobile){
        		//显示插屏广告
        		var ret = jsb.reflection.callStaticMethod("NativeOcClass","callNativeShowInterstitial");
        	}
                                     
        	cc.director.runScene(new SysMenu.scene());
        });

        backBtn.x=belowLayer.width*num;
        backBtn.y=belowLayer.height/2;;
	},
	/**按钮回调*/
	onTouchBeganBack:function(){},
	/**按钮回调*/
	onTouchEndedBack:function(){
		if(this.gameState==0||this.gameState==2){
			this.setButtonSpriteState();
		}else if(this.gameState==1){
			if(this.lookNum>=GamePlaysLayer.lookNumMax){
				return;
			}
			this.lookNum++;

			//this.buttonSprite.setText("继 续");
			this.gameState=2;
			
			var infoSprite=this.buttonSprite.infoSprite;
			infoSprite.setTexture(res.continue_png);
			
			this.viewLabel.setVisible(false);
			
			var array=GamePlaysLayer.unitSpriteArray;
			for(var i=0;i<array.length;i++){
				var o=array[i];
				o.showLabel();
			}
		}
	},
	/**游戏开始时，按钮设置为查看状态*/
	setButtonSpriteState:function(){
		//this.buttonSprite.setText("查看["+(GamePlaysLayer.lookNumMax-this.lookNum)+"]");
		this.gameState=1;
		
		var infoSprite=this.buttonSprite.infoSprite;
		infoSprite.setTexture(res.view_png);
		
		this.viewLabel.setVisible(true);
		this.viewLabel.setString("("+(this.lookNum)+"/"+GamePlaysLayer.lookNumMax+")");
		
		var array=GamePlaysLayer.unitSpriteArray;
		for(var i=0;i<array.length;i++){
			var o=array[i];
			o.hideLabel();
			if(GS.gameType==1){
				//正确位置显示
				if(o.index==o.index0){
					o.showLabel();
				}
			}
		}
	},
	/**初始化上方的layer*/
	initTopLayer:function(){
		var topLayer=this.topLayer=new cc.LayerColor(cc.color(255, 255, 255, 1),this.centerLayer.width,(winSize.height-this.centerLayer.height)/4);
		this.addChild(topLayer);
		topLayer.x=(winSize.width-topLayer.width)/2;
		topLayer.y=winSize.height-topLayer.height*15/8;
		
		//显示的难度信息
		var typeSp=new cc.Sprite(res.dddd_02_png);
		topLayer.addChild(typeSp);
		typeSp.y=topLayer.height/2;;
		typeSp.x=topLayer.width*1/7;

		var str="";
		if(GS.gameType==0){
			str=res.hd_cn_png;
		}else if(GS.gameType==1){
			str=res.hd_gs_png;
		}else{
			str=res.hd_ds_png;
		}
		var typeSpInfo=new cc.Sprite(str);
		topLayer.addChild(typeSpInfo);
		typeSpInfo.y=typeSp.y;
		typeSpInfo.x=typeSp.x+typeSpInfo.width/3;
		
		//--
		//显示的步数信息
		var sp=new cc.Sprite(res.di_png);
		topLayer.addChild(sp);
		sp.y=topLayer.height/2+sp.height/2;
		sp.x=topLayer.width*11/15;
		
		var sp2=new cc.Sprite(res.bu_png);
		topLayer.addChild(sp2);
		sp2.y=sp.y;
		sp2.x=topLayer.width*4/5+sp.width*2;
		
		var stepLabel=this.stepLabel= new cc.LabelBMFont("0", res.step_num_fnt);
		topLayer.addChild(stepLabel);
		stepLabel.y=sp.y+sp.y/20;
		stepLabel.x=sp.x+sp.width*1.5;
		stepLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;
		
		var step=this.step=0;

		//--
		var zqSp=new cc.Sprite("#zq.png");
		topLayer.addChild(zqSp);
		zqSp.x=sp.x+sp.width/2;
		zqSp.y=sp.y-sp.height*12/10;
		
		/**
		var infoLabel=this.infoLabel=new cc.LabelTTF("0/8","Arial",30);
		topLayer.addChild(infoLabel);
		infoLabel.x=stepLabel.x;
		infoLabel.y=stepLabel.y-stepLabel.height*2;
		*/
		
		var infoLabel=this.infoLabel= new cc.LabelBMFont("0/8", res.step_num_fnt);
		topLayer.addChild(infoLabel);
		infoLabel.x=zqSp.x+zqSp.width;
		infoLabel.y=zqSp.y+4;
		infoLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;
	},
	/**初始化战斗结果layer*/
	initResultLayer:function(){
		this.resultLayer=new cc.LayerColor(cc.color(0, 0, 0, 80),winSize.width,winSize.height);
		this.resultLayer.setVisible(false);
		this.resultLayer.setScale(0.0001);
		this.addChild(this.resultLayer);
		
		var listener1 = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {
				var target = event.getCurrentTarget();
				var locationInNode = target.convertToNodeSpace(touch.getLocation());
				var s = target.getContentSize();
				var rect = cc.rect(0, 0, s.width, s.height);
				if (cc.rectContainsPoint(rect, locationInNode)) {
					return true;
				}
				return false;
			},
			onTouchMoved: function (touch, event) {
			},
			onTouchEnded: function (touch, event) {
			}
		});
		cc.eventManager.addListener(listener1, this.resultLayer);

		//背景框
		var resultSp=new cc.Sprite(res.box1_png);
		this.resultLayer.addChild(resultSp);
		resultSp.x=this.resultLayer.width/2;
		resultSp.y=this.resultLayer.height/2;

		//蜗牛
		var resultSp2=new cc.Sprite(res.snail_png);
		this.resultLayer.addChild(resultSp2);
		resultSp2.x=resultSp.x;
		resultSp2.y=resultSp.y+resultSp2.height*2/3;

		var label=this.resultLabel=new cc.LabelTTF("您共用8步通过本关","Arial",40);
		this.resultLayer.addChild(label);
		label.x=resultSp.x;
		label.y=resultSp2.y-resultSp2.height*2/3;
		label.color=cc.color(132,84,61,255);

		var label2=this.resultLabel2=new cc.LabelTTF("","Arial",25);
		this.resultLayer.addChild(label2);
		label2.x=label.x;
		label2.y=label.y-label.height;;
		label2.color=cc.color(132,84,61,255);

		//分数
		var label3=this.resultLabel3=new cc.LabelTTF("","Arial",35);
		this.resultLayer.addChild(label3);
		label3.x=label2.x;
		label3.y=label2.y-label.height;
		label3.color=cc.color(1232,93,15,255);
		
		//首页
		var btn=new ButtonSprite("",res.home_png,"",this.resultLayer,null,function(){
				//cc.director.runScene(new cc.TransitionFade(0.4,new SysMenu.scene()));
				cc.director.runScene(new SysMenu.scene());
			}.bind(this));
		btn.x = this.resultLayer.width / 3;
		btn.y = resultSp.y-resultSp.height/2+btn.height/6;

        //重玩
        var btn2=new ButtonSprite("",res.refresh_png,"",this.resultLayer,null,function(){
        	if(cc.sys.isMobile){
        		//创建横幅广告
        		var ret = jsb.reflection.callStaticMethod("NativeOcClass","callNativeCreateBanner");
        	}
       
        	this.reStart();
        }.bind(this));
		btn2.x = this.resultLayer.width*2 / 3;
        btn2.y = btn.y;

	},
	/**重新开始*/
	reStart:function(){
		this.resultLayer.setVisible(false);
		this.resultLayer.setScale(0.0001);
		if(GS.gameType==0){
			this.gameState=1;
		}else{
			this.gameState=0;
			
			var infoSprite=this.buttonSprite.infoSprite;
			infoSprite.setTexture(res.start_png);
			//this.buttonSprite.setText("开 始");
			this.viewLabel.setVisible(false);
		}
		
		//打乱方块
		this.disorderUnitSprite();

		//重置分数
		this.setStep(1);

		if(this.preUnit){
			//this.preUnit.boxLayer.setColor(UnitSprite.unSelectColor)
		}
		this.preUnit=null;

		this.lookNum=0;

		var array=GamePlaysLayer.unitSpriteArray
		for(var i=0;i<array.length;i++){
			var o=array[i];
			o.showLabel();
		}
	},
	/**初始化中间的布局*/
	initCenter:function(){
		var height = winSize.height*9/10;
		var width = height;
		var layer=this.centerLayer=new cc.LayerColor(cc.color(255, 255, 255, 128), width,height);
		this.addChild(layer);
		layer.x=(winSize.width-layer.width)/2;
		layer.y=(winSize.height-layer.height)/2;

		
		//初始化常量
		UnitSprite.width=UnitSprite.height=layer.width/GamePlaysLayer.row;
		
		//初始化方块
		for(var i=0;i<GamePlaysLayer.row*GamePlaysLayer.row;i++){
			
			var hide=false;
			if(i==GamePlaysLayer.row*GamePlaysLayer.row-1){
				hide=true;
			}
			var sp=new UnitSprite(i,hide,this);
			this.setUnitSpritePosition(sp);
			layer.addChild(sp);
			
			GamePlaysLayer.unitSpriteArray.push(sp);
		}

		//打乱方块
		this.disorderUnitSprite();
		
		if(GS.gameType==0){
			this.gameState=1;
		}else{
			this.gameState=0;
		}
	},
	/**打乱方块*/
	disorderUnitSprite:function(){
		//TODO
		for(var j=0;j<100;j++){
			var hideSp=null;//隐藏块
			var array=GamePlaysLayer.unitSpriteArray;
			for(var i=0;i<array.length;i++){
				var o=array[i];
				if(o.hide){
					hideSp=o;
					break;
				}
			}

			var moveArray=[];
			var hideIndex=hideSp.index;
			for(var i=0;i<array.length;i++){
				var o=array[i];
				if(!o.hide){
					if(this.checkMove(o.index,hideSp.index)){
						moveArray.push(o);
					}
				}
			}

			var length=moveArray.length;
			var num=Math.floor(Math.random()*length);//用Math.floor(Math.random()*10);时，可均衡获取0到9的随机整数。
			var spa=moveArray[num];

			if(!spa){
				cc.log();
			}
			
			this.exchangePosition(spa,hideSp,false);
//			cc.log(spa.index+","+hideSp.index);
			
			//spa.boxLayer.setColor(UnitSprite.unSelectColor);
		}

		if(this.infoLabel){
			var num=0;
			var array=GamePlaysLayer.unitSpriteArray;
			for(var i=0;i<array.length;i++){
				var o=array[i];
				if(o.index!=o.index0&&o.index0!=8){
					num++;
				}
			}
			this.infoLabel.setString((8-num)+"/8");
		}

		this.lookNum=0;
	},
	/**交换单元块的位置
	 * flag:true表示按action移动；false表示不移动
	 * */
	exchangePosition:function(spa,spb,flag){
		var indexTmp=spa.index;
		spa.index=spb.index;
		spb.index=indexTmp;
		
		if(!spa){
			cc.log(1);
		}
		
		this.setUnitSpritePosition(spa,flag);
		
		//不移动隐藏行
		if(!flag){
			this.setUnitSpritePosition(spb,flag);
		}
	},
	/**设置单元块的位置
	 * flag:true表示按action移动；false表示不移动
	 * */
	setUnitSpritePosition:function(sp,flag){
		
		var p=this.getPointByIndex(sp.index);
		var x=p.x
		var y=p.y
		
		if(flag){
			//移动
			var action=cc.moveTo(0.07,cc.p(x,y));
			//var action=cc.moveTo(1,cc.p(x,y));
			sp.runAction(new cc.Sequence(action,new cc.CallFunc(function(){
					if(this.preUnit!=sp){
						//sp.boxLayer.setColor(UnitSprite.unSelectColor)
					}
				},this)));
		}else{
			sp.x=x;
			sp.y=y
		}
	},
	/**获取索引对应的坐标*/
	getPointByIndex:function(index){
		var h=this.centerLayer.height;
		
		var x=(0|(index)%GamePlaysLayer.row)*UnitSprite.width;
		var y=h-(0|(index)/GamePlaysLayer.row+1)*UnitSprite.height;
		
		return cc.p(x,y);
	},
	/**移动单元块*/
	moveUnitSprite:function(sp){
		if(this.gameState!=1){
			//处于未开始状态
			return;
		}
		//点击的是隐藏块
		if(sp.hide){
			return;
		}
		
		//隐藏块
		var hideSp=this.getHideSprite();
		
		if(this.checkMove(sp.index,hideSp.index)){
			this.exchangePosition(sp,hideSp,true);
			
			this.setStep();
			
			//验证结果
			if(this.checkResult()){
				this.gameState=2;
				
				var array=GamePlaysLayer.unitSpriteArray
				for(var i=0;i<array.length;i++){
					var o=array[i];
					o.showLabel();
				}

				var min=this.getSteps(GS.gameType);
				if(min>0){
					this.resultLabel2.setString("(历史最好成绩："+min+"步)");
				}

				this.resultLabel.setString("您共用"+this.step+"步通过本关");
				this.resultLayer.setScale(1);
				this.resultLayer.setVisible(true);

				var score=1000-this.step;//GameCenter使用
				this.resultLabel3.setString("得分："+score);
				
				//持久化
				this.setSteps(GS.gameType,this.step);
			}
		}else{
			//sp.boxLayer.setColor(UnitSprite.unSelectColor)
			
			if(cc.sys.isMobile){
				if(this.step==100||this.step==200||this.step==300){
					//显示横幅广告
					var ret = jsb.reflection.callStaticMethod("NativeOcClass","callNativeShowBanner");
				}
			}
		}
	},
	/**获得隐藏团的图块精灵*/
	getHideSprite:function(){
		var hideSp=null;//隐藏块
		var array=GamePlaysLayer.unitSpriteArray;
		for(var i=0;i<array.length;i++){
			var o=array[i];
			if(o.hide){
				hideSp=o;
				break;
			}
		}
		return hideSp;
	},
	/**设置步数*/
	setStep:function(clear){
		if(!clear){
			this.step++;
		}else{
			this.step=0;
		}
		
		this.stepLabel.setString(this.step);
	},
	/**验证是否可以移动:验证是否位于同一行或同一列*/
	checkMove:function(index,hideIndex){
		var flag=false;
		//位于同一行
		if((0|index/GamePlaysLayer.row)==(0|hideIndex/GamePlaysLayer.row)){
//			cc.log("同一行");
			if(Math.abs(index-hideIndex)==1){
				flag=true;
			}
		}else if(index%GamePlaysLayer.row==hideIndex%GamePlaysLayer.row){
//			cc.log("同一列");
			if(Math.abs(index-hideIndex)==GamePlaysLayer.row){
				flag=true;
			}
		}
		return flag;
	},
	/**验证结果*/
	checkResult:function(){
		var num=0;
		var array=GamePlaysLayer.unitSpriteArray;

		for(var i=0;i<array.length;i++){
			var o=array[i];
			if(o.index!=o.index0&&o.index0!=8){
				num++;
			}
		}

		this.infoLabel.setString((8-num)+"/8");

		if(num==0){
			return true;
		}else{
			return false;
		}
	},
	/**获取游戏记录*/
	getSteps:function(type){
		var k="s"+type;
		var min=GS.steps[k];
		return min;
	},
	/**设置游戏记录*/
	setSteps:function(type,step){
		var k="s"+type;
		var min=GS.steps[k];
		if(step<min||min==0){
			GS.steps[k]=step;

			var model=GS.LocalStorageModel;
			model.steps=GS.steps;
			model.sound=GS.sound;

			var info=JSON.stringify(model);

			//存储
			GS.setLocalStorage(GS.LocalStorageKey,info);
			
			//Gamecenter上传分数
			if(cc.sys.isMobile){
				var score=1000-this.step;//GameCenter使用
				var ret = jsb.reflection.callStaticMethod("NativeOcClass","reportScore:forType:",score,type);
			}
		}
	}
});
//常量
/**具有的行（列）数*/
GamePlaysLayer.row=3;
/**每局最多可以查看的次数*/
GamePlaysLayer.lookNumMax=2;
/**单元格子*/
GamePlaysLayer.unitSpriteArray=[];
/**移动时选中的单元格*/
GamePlaysLayer.checkUnitArray=[];

/*
描述：显示游戏的信息
1.游戏难度
2.总共走的步数
3.目前已经正确的个数
 */
 var GamePlaysInformationLayer = cc.Layer.extend({
	ctor: function (games) {
		this._super();
		this._games = games;
		this.initData();
	},
	initData: function () {
		//显示的难度信息
		var typeSp=new cc.Sprite(res.dddd_02_png);
		typeSp.setAnchorPoint(0.5,1);
		typeSp.setPosition(winSize.width*1/5,winSize.height);
		this.addChild(typeSp);

		this.setGameType(typeSp);

		this.initScoreInformation();
	},

	//设置游戏难度信息
	setGameType:function(bg){
		var size = bg.getContentSize();
		var str="";
		if(this._games == GameConfig.GameList.GamePlay1){
			str=res.hd_cn_png;
		}else if(this._games == GameConfig.GameList.GamePlay2){
			str=res.hd_gs_png;
		}else{
			str=res.hd_ds_png;
		}
		var typeSpInfo=new cc.Sprite(str);
		typeSpInfo.setPosition(size.width*0.5,size.height*1/3);
		bg.addChild(typeSpInfo);
	},
	initScoreInformation: function () {
		//显示的步数信息
		var height = winSize.height;
		var sp=new cc.Sprite(res.di_png);
		sp.setAnchorPoint(0.5,1);
		sp.setPosition(winSize.width*11/15,height);
		this.addChild(sp);

		var sp2=new cc.Sprite(res.bu_png);
		sp2.setAnchorPoint(0.5,1);
		sp2.setPosition(winSize.width*4/5,sp.y);
		this.addChild(sp2);

		var stepLabel=this.stepLabel=this.stepLabel= new cc.LabelBMFont("0", res.step_num_fnt);
		stepLabel.setAnchorPoint(0.5,1);
		stepLabel.setPosition((sp.x+sp2.x)/2,height)
		this.addChild(stepLabel);
		stepLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;


		var height2 = height - sp.width*1.4;
		//显示正确的步数
		var zqSp=new cc.Sprite("#zq.png");
		zqSp.setPosition(sp.x+sp.width/2,height2);
		this.addChild(zqSp);

		var infoLabel=this.infoLabel= new cc.LabelBMFont("0/8", res.step_num_fnt);
		infoLabel.setPosition(zqSp.x+zqSp.width,zqSp.y);
		this.addChild(infoLabel);
		infoLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;
	},
	 /*
	 设置步数
	  */
	 setStep: function (num) {
		this.stepLabel.setString(num);
	 },
	 /*
	 设置显示正确的格式
	  */
	 setRightPositionNumber: function (num) {
		 this.infoLabel.setString(num);
	 }
});
/*
 描述：显示游戏结束信息
 */
var GamePlayResultLayer = PopUpBaseLayer.extend({
	ctor: function (games) {
		this._super();
		this._games = games;
		this.initData();
		this.initListener();
	},
	initData: function () {
		//背景框
		var resultBg=new cc.Sprite(res.box1_png);
		resultBg.setPosition(winSize.width*0.5,winSize.height*0.5);
		this.addChild(resultBg);
		var size = resultBg.getContentSize();

		//蜗牛
		var resultSp2=new cc.Sprite(res.snail_png);
		resultBg.addChild(resultSp2);
		resultSp2.setPosition(size.width*0.5,size.height*0.95);

		var label=this.resultStepLabel=new cc.LabelTTF("您共用8步通过本关","Arial",40);
		resultBg.addChild(label);
		label.setPosition(size.width*0.5,size.height*0.5);
		label.color=cc.color(132,84,61,255);

		var label2=this.resultScoreLabel=new cc.LabelTTF("得分：800","Arial",25);
		resultBg.addChild(label2);
		label2.setPosition(size.width*0.5,size.height*0.25);
		label2.color=cc.color(132,84,61,255);

		this.initButton(resultBg);

		return;
		//首页
		var btn=new ButtonSprite("",res.home_png,"",this.resultLayer,null,function(){
			//cc.director.runScene(new cc.TransitionFade(0.4,new SysMenu.scene()));
			cc.director.runScene(new SysMenu.scene());
		}.bind(this));
		btn.x = this.resultLayer.width / 3;
		btn.y = resultSp.y-resultSp.height/2+btn.height/6;

		//重玩
		var btn2=new ButtonSprite("",res.refresh_png,"",this.resultLayer,null,function(){
			if(cc.sys.isMobile){
				//创建横幅广告
				var ret = jsb.reflection.callStaticMethod("NativeOcClass","callNativeCreateBanner");
			}

			this.reStart();
		}.bind(this));
		btn2.x = this.resultLayer.width*2 / 3;
		btn2.y = btn.y;
	},
	initButton:function(bg){
		var size = bg.getContentSize();

		var buttonBack = new ccui.Button(res.home_png,res.home_png);
		buttonBack.setTouchEnabled(true);
		buttonBack.setPressedActionEnabled(true);
		buttonBack.addTouchEventListener(this.onGameResultButtonTouch,this);
		buttonBack.setPosition(size.width*0.05,size.height*0.95);
		buttonBack.setTag(GamePlayResultLayer.Tag.ButtonTag_Back);
		bg.addChild(buttonBack);

		var buttonRestart = new ccui.Button(res.refresh_png,res.refresh_png);
		buttonRestart.setTouchEnabled(true);
		buttonRestart.setPressedActionEnabled(true);
		buttonRestart.addTouchEventListener(this.onGameResultButtonTouch,this);
		buttonRestart.setPosition(size.width*0.95,size.height*0.95);
		buttonRestart.setTag(GamePlayResultLayer.Tag.ButtonTag_Restart);
		bg.addChild(buttonRestart);
	},
	onGameResultButtonTouch:function(sender,type){
		if(type==ccui.Widget.TOUCH_ENDED) {
			var tag = sender.getTag();
			sender.setTouchEnabled(false);
			switch (tag) {
				case GamePlayResultLayer.Tag.ButtonTag_Back:
					cc.director.runScene(new MainScene.scene());
					break;
				case GamePlayResultLayer.Tag.ButtonTag_Restart:
					cc.director.runScene(new GameScene(this._games));
					break;
			}

	}
	},
	//设置得分
	setScore:function(score){
		this.resultScoreLabel.setString("得分："+score);
	},
	//设置走的步数
	setStep:function(step){
		this.resultStepLabel.setString("您共用"+step+"步通过本关");
	}

});
GamePlayResultLayer.Tag = {
	ButtonTag_Back:		1,
	ButtonTag_Restart:	2,
}