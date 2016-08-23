var GamePlaysLayer=GameBaseLayer.extend({
	centerLayer:null,//中间位置的layer
	gameState:0,//游戏状态：1为开始；2为结束、暂停；
	resultLayer:null,//显示结果的layer
	buttonSprite:null,//控制开始、查看、继续的按钮
	preUnit:null,//上一个选中的单元（设置为选中的颜色）
	step:0,//移动的步数
	lookNum:0,//查看次数
	_hideValue:0,//需要隐藏的数字
	ctor:function(games){
		this._super(games);
		this.initArray();
		this.initData();
	},
	initArray: function () {
		this._arrImage = [];
		for(var i = 0; i < GamePlaysLayer.Sum;i++){
			var name = "res/"+ i +".png";
			this._arrImage.push(name);
		}

		//目标矩阵
		this._arrAim = [
			1,2,3,
			4,5,6,
			7,8,0
		];
	},
	initData:function(){
		/**加载plist文件*/
		cc.spriteFrameCache.addSpriteFrames(res.nums_plist);
		
		var bgSprite=new cc.Sprite(res.Bg_GamePlay_Jpg);
		bgSprite.setPosition(winSize.width*0.5,winSize.height*0.5);
		this.addChild(bgSprite);
		this._size = bgSprite.getContentSize();
		this._bg = bgSprite;　

		this.initPositionArray();

		this.initNumber();
		/**单元格子*/
		GamePlaysLayer.unitSpriteArray=[];
		/**移动时选中的单元格*/
		GamePlaysLayer.checkUnitArray=[];

		//初始化中间的布局
		//this.initCenter();

		//var layer = new GamePlaysInformationLayer(this.getTag());
		//this.addChild(layer);


		//this.showResultLayer();

		return;
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
	initPositionArray:function(){
		var offx = 185;
		var offy = 185;
		this._arrOriginalPosition = [];
		for(var i = 0;i < GamePlaysLayer.row;i++){
			for(var k = 0;k < GamePlaysLayer.row;k++){
				var pos = cc.p(this._size.width*0.5-offx + offx*k,this._size.height*0.5 + offy - offy*i);
				this._arrOriginalPosition.push(pos);
			}
		}
	},
	//初始化1 - 8
	initNumber:function(){
		//计时开始
		//this.schedule(this.updateCountTime,1.0);

		var arrGroupNumber = this.createGroupRndNumberArray();
		this._curArray = arrGroupNumber;

		cc.log("initNumber="+this._curArray);
		//保存所有的精灵
		if(this._arrAllSprite){
			arrayUtils.removeAllItems(this._arrAllSprite, true);
		}

		this._arrAllSprite = [];
		for(i = 0;i < GamePlaysLayer.Sum;i++){
			var pos = this._arrOriginalPosition[i];
			cc.log("this._curArray[i]="+this._curArray[i]);
			var number = new cc.Sprite(this._arrImage[this._curArray[i]]);
			number.setPosition(pos);
			this._bg.addChild(number);
			this._arrAllSprite.push(number);
			if(this._curArray[i] == this._hideValue){
				number.setOpacity(0);
			}
		}
	},
	//把一个正常顺序的数组 逆转 n 次  得到一个新的数组
	createGroupRndNumberArray:function(){
		var rnd = utils.getRandom(100, 1000);
		var count = 0;

		var arrCur = this._arrAim.slice(0);
		cc.log("createGroupRndNumberArray="+)
		this._curArray = arrCur;
		while(1){
			if(count == rnd){
				return arrCur;
			}
			var dir = utils.getRandom(0, 3);
			this.changeCurArrayValue(dir);
			count++;
		}
	},
	getHideSpriteIndex:function(arr){
		var len = arr.length;
		for(var i = 0;i < len;i++){
			var value = arr[i];
			if(value == this._hideValue){
				return i;
			}
		}
		return -1
	},
	getHideSpriteAroundIndexArray:function(){
		var i = this.getHideSpriteIndex(this._curArray);

		var arr = [];
		var up = i - 3;
		var down = i + 3;
		var right = i + 1;
		if(parseInt((right)/3) != parseInt((i)/3)){
			right = -1
		}
		var left = i - 1;
		if(parseInt((left)/3) != parseInt((i)/3)){
			left = -1
		}
		arr.push(up);
		arr.push(down);
		arr.push(left);
		arr.push(right);

		for(var i = 0;i < arr.length;i++){
			if(arr[i] < 0 || arr[i] > 8){
				arr[i] = -1;
			}
		}
		return arr;
	},
	showResultLayer: function () {
		var layer = new GamePlayResultLayer(this.getTag());
		this.addChild(layer,100);
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
	changeCurArrayValue:function(direction){
		if(direction != -1){
			var index = this.getHideSpriteIndex(this._curArray);
			var arrayAroundIndex = this.getHideSpriteAroundIndexArray();
			this._curArray[index] = this._curArray[arrayAroundIndex[direction]];
			this._curArray[arrayAroundIndex[direction]] = this._hideValue;
		}
	},
	//与可以碰撞的精灵是否发生判断
	getCheckCollosion:function(worldPos){
		var arrayAroundIndex = this.getHideSpriteAroundIndexArray(index);
		var  len = arrayAroundIndex.length;
		var nodePos = this._bg.convertToNodeSpace(worldPos);
		for(var i = 0;i < len;i++){
			if(arrayAroundIndex[i] != -1){
				var sprite = this._arrAllSprite[arrayAroundIndex[i]];
				var rect = sprite.getBoundingBox();
				if(cc.rectContainsPoint(rect, nodePos)){
					sprite._dir = i;
					return sprite;
				}
			}
		}
		return false;
	},
	//是否需要刷新
	isRefresh:function(worldPos){
		var dir = this._curCollosionSpirte._dir;
		var offxy = 100;
		cc.log("===>isRefresh",worldPos.y,this._curPos.y,dir);
		switch(dir){
			case 1://上
				if(worldPos.y - this._curPos.y > offxy){
					return true;
				}
				break;
			case 0://下
				if(worldPos.y - this._curPos.y < -offxy){
					return true;
				}
				break;
			case 3://左
				if(worldPos.x - this._curPos.x < -offxy){
					return true;
				}
				break;
			case 2://右
				if(worldPos.x - this._curPos.x > offxy){
					return true;
				}
				break;

		}
		return false;
	},
	//置换数组元素
	changeSpritePosition:function(){
		var dir = this._curCollosionSpirte._dir;

		this.changeCurArrayValue(dir);

		this.refreshSprite();
		this.refreshTimeGrade();
		if(this.isFinish()){
			cc.log("===>isFinish");
			this.showAllSprite();
			cc.eventManager.removeListeners(this.listener);
			//this.unschedule(this.updateCountTime);
			//显示结束界面
			var action = cc.sequence(cc.delayTime(2.0),cc.callFunc(function(){
				this.showGameEnd();
			},this));
			this.runAction(action);
		}
	},
	onTouchBegan : function(touch, event){
		var target = event.getCurrentTarget();
		var touchPos = touch.getLocation();

		target._curPos = null;
		target._curCollosionSpirte = target.getCheckCollosion(touchPos);
		if(target._curCollosionSpirte){
			cc.log("==>点击可点精灵");
			target._curPos = touchPos;
		}
		return true;
	},
	onTouchMoved : function(touch, event){
		var target = event.getCurrentTarget();
		var touchPos = touch.getLocation();
	},
	onTouchEnded : function(touch, event){
		var target = event.getCurrentTarget();
		var touchPos = touch.getLocation();

		if(target._curPos && target.isRefresh(touchPos)){
			target.changeSpritePosition();
			cc.log("==>onTouchEnded");
			target._curPos = null;
		}
	},
});
//常量
/*总共拼图的个数*/
GamePlaysLayer.Sum = 9;
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