var GamePlaysLayer=GameBaseLayer.extend({
	centerLayer:null,//中间位置的layer
	gameState:0,//游戏状态：1为开始；2为结束、暂停；
	resultLayer:null,//显示结果的layer
	buttonSprite:null,//控制开始、查看、继续的按钮
	preUnit:null,//上一个选中的单元（设置为选中的颜色）
	_step:0,//移动的步数
	lookNum:0,//查看次数
	_hideValue:0,//需要隐藏的数字
	ctor:function(games){
		this._super(games);
		this.initArray();
		this.initData();
		this.initListener();
	},
	initArray: function () {
		this._arrImage = [];
		for(var i = 0; i < GamePlaysLayer.Sum;i++){
			var name = "res/"+ (i) +".png";
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

		this.addElementFrame();

		this.initNumber();

		this.initGamesInformationLayer();

		//this.showResultLayer();
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
	initNumber:function(isFirst){
		//计时开始
		//this.schedule(this.updateCountTime,1.0);

		var arrGroupNumber = this.createGroupRndNumberArray();
		this._curArray = arrGroupNumber;
		cc.log("initNumber="+this._curArray);

		this.updateSprite();

	},
	addElementFrame: function () {
		var image = new ccui.ImageView(res.Sprite_Di_Png);
		image.setPosition(this._arrOriginalPosition[4]);
		image.setScale9Enabled(true);
		image.setContentSize(this._size.height,this._size.height);
		this._bg.addChild(image);
	},
	updateSprite:function(){

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
				//number.setOpacity(0);
			}
			cc.log("===>this._curArray[i]="+this._curArray[i]);
			//添加数字
			var num = new cc.LabelTTF("" + this._curArray[i],"Arial",30);
			num.setNormalizedPosition(0.5,0.5);
			num.setColor(cc.color(0,255,255));
			number.addChild(num)
		}
	},
	//把一个正常顺序的数组 逆转 n 次  得到一个新的数组
	createGroupRndNumberArray:function(){
		var rnd = utils.getRandom(100, 1000);
		var count = 0;

		var arrCur = this._arrAim.slice(0);
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
		cc.error("数组元素缺失");
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
		this._gameResultLayer = layer;

		this._gameResultLayer.setScore(this._step*10);
		this._gameResultLayer.setStep(this._step);
	},
	initGamesInformationLayer: function () {
		var layer = new GamePlaysInformationLayer(this.getTag());
		this.addChild(layer);
		this._gameInformationLayer = layer;
	},
	changeCurArrayValue:function(direction){
		var index = this.getHideSpriteIndex(this._curArray);
		var arrayAroundIndex = this.getHideSpriteAroundIndexArray();
		//cc.log("====>direction="+direction);
		if(direction != -1 &&arrayAroundIndex[direction]!=-1){
			this._curArray[index] = this._curArray[arrayAroundIndex[direction]];
			this._curArray[arrayAroundIndex[direction]] = this._hideValue;
		}
	},
	//与可以碰撞的精灵是否发生判断
	getCheckCollosion:function(worldPos){
		var arrayAroundIndex = this.getHideSpriteAroundIndexArray();
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

		this._step++;

		this.refreshScoreInformation();

		if(this.isFinish()){
			cc.log("===>isFinish");
			this.showAllSprite();
			cc.eventManager.removeListeners(this.listener);
			//显示结束界面
			var action = cc.sequence(cc.delayTime(2.0),cc.callFunc(function(){
				this.showResultLayer();
			},this));
			this.runAction(action);
		}
	},
	isFinish:function(){
		var len = this._arrAim.length;
		for(var i = 0;i < len;i++){
			cc.log("==>",len,this._arrAim[i],this._curArray[i]);
			if(this._arrAim[i] != this._curArray[i]){
				return false
			}
		}
		return true;
	},
	//刷新精灵
	refreshSprite:function(){
		//removeAllItem
		this.updateSprite();
		this._stepsValue++;
	},
	showAllSprite:function(){
		var len = this._arrAllSprite.length;
		for(i = 0;i < len;i++){
			var number = this._arrAllSprite[i];
			number.setVisible(true);
		}
	},
	/*
	 设置步数
	 */
	setStep: function () {
		this._gameInformationLayer.setStep(this._step);
	},
	/*
	 设置显示正确的格式
	 */
	setRightPositionNumber: function () {
		var number = this.getRightPositionCount();
		this._gameInformationLayer.setRightPositionNumber(number);
	},
	//检测显示正确的步数
	getRightPositionCount: function () {
		var len = this._arrAim.length;
		var count = 0;
		for(var i = 0;i < len;i++){
			cc.log("==>",len,this._arrAim[i],this._curArray[i]);
			if(this._arrAim[i] == this._curArray[i]){
				count++;
			}
		}
		return count;
	},
	refreshScoreInformation:function(){
		this.setStep();
		this.setRightPositionNumber();
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
		typeSp.setAnchorPoint(1,1);
		typeSp.setPosition(winSize.width*0.45,winSize.height);
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
		sp.setAnchorPoint(0,1);
		sp.setPosition(winSize.width*0.55,height);
		this.addChild(sp);

		var size = sp.getContentSize();
		var sp2=new cc.Sprite(res.bu_png);
		sp2.setAnchorPoint(0,1);
		sp2.setPosition(sp.getPositionX() + size.width*3,sp.y);
		this.addChild(sp2);

		var stepLabel=this.stepLabel=this.stepLabel= new cc.LabelBMFont("0", res.step_num_fnt);
		stepLabel.setAnchorPoint(0,1);
		stepLabel.setPosition((sp.x+sp2.x)/2,height)
		this.addChild(stepLabel);
		stepLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;


		var height2 = height - sp.width*1.4;
		//显示正确的步数
		var zqSp=new cc.Sprite("#zq.png");
		zqSp.setAnchorPoint(0,0.5);
		zqSp.setPosition(sp.x,height2);
		this.addChild(zqSp);

		var infoLabel=this.infoLabel= new cc.LabelBMFont("0/8", res.step_num_fnt);
		infoLabel.setAnchorPoint(0,0.5);
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
		this._super(games);
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
					cc.director.runScene(new MainScene());
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