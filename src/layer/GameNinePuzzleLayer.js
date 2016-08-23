/*****************************************************

 ** 作者： linzhangfeng

 ** 创始时间： 2016-1-8

 ** 描述：认数字九宫拼图 …
 
 *****************************************************/
var GameNinePuzzleLayer = GameBaseLayer.extend({	//认数字0-100
	_gameState:false,
	_cat:false,
	_curStartNumber:0,//当前初始数字值
	_isClickBtns:true,
	_moveDownSpeed:1,
	_freecount:10,
	_getMoneySum:0,
	_hideValue :6,
	_timeValue:0,
	_stepsValue:0,
	_levelCount:0,
	_freecount:1,
	ctor:function(tag,level){
		this._super(tag);
		this._levelCount = level||0;
		winSize = cc.director.getVisibleSize();
		this.initListener();
		this.getRect();
//		this.initUi(bgSprite);
		this.initSoundsName();
		this.initAimArr();
		this.initData();
	},
	initStartPosArr:function(){
		var hor = 3;
		var ver = 3;
		
		var offx = 674/3;
		var offy = 674/3;
		this._arrStartPos = [];
		for(var i = 0;i < hor;i++){
			for(var k = 0;k < ver;k++){
				var pos = cc.p(this._size.width*0.5-offx + offx*k,this._size.height*0.53 + offy - offy*i);
				this._arrStartPos.push(pos);
			}
		}
	},
	getRect:function(){
		var width = 674/3;
		var hor = 3;
		var ver = 3;
		
		this._rect = [];
		for(var i = 0;i < hor;i++){
			for(var k = 0;k < ver;k++){
				var rect = cc.rect(width*k,width*i,width,width);
				this._rect.push(rect);
			}
		}
	},
	initAimArr:function(){
		this._arrAim = [
		                0,1,2,
		                3,4,5,
		                6,7,8
		                ]
		
		//没有付费时，定义死矩阵
		this._arrStatic = [
		                   6,3,7,
		                   2,1,5,
		                   4,0,8
		                   ] 
	},
	initSoundsName:function(){
		//初始化所有的大图
		this._arrBigPicture = [];
		for(var i = 0;i < GameNinePuzzleLayer.LevelSum;i++){
			var name = "res/sprite/PT_000_" + i + ".png";
			this._arrBigPicture.push(name);
		}
	},
	initData:function(){
		var bgSprite = new cc.Sprite(res.Bg_GamePlay_Jpg);
		bgSprite.setNormalizedPosition(cc.p(0.5,0.5));
		this.addChild(bgSprite);
		this._bg = bgSprite;
		this._size = bgSprite.getContentSize();
		
		this.initStartPosArr();
		
		//精灵低框
		var dikuang = new cc.Sprite(res.PuzzleNine_Kuang);
		var pos = this._arrStartPos[4];
		var offxy = 0;
		dikuang.setPosition(pos.x+ offxy/2,pos.y-offxy);
		this._bg.addChild(dikuang);

		this.initNumber();
		
	},
	updateCountTime:function(f){
		this._timeValue++;
		this._time.setString(this._timeValue);
	},
	//初始化1 - 8
	initNumber:function(){
		//计时开始
		//this.schedule(this.updateCountTime,1.0);
		
		var arrGroupNumber = this.createGroupRndNumberArr();
		this._curArr = arrGroupNumber;
		//保存所有的精灵
		if(this._arrAllSprite){
			arrayUtils.removeAllItems(this._arrAllSprite, true);
		}
		this._arrAllSprite = [];
		for(i = 0;i < GameNinePuzzleLayer.NumSum;i++){
			var pos = this._arrStartPos[i];			
			var name = this._arrBigPicture[this._levelCount];
			var number = new cc.Sprite(name,this._rect[arrGroupNumber[i]]);
			number.setPosition(pos);
			cc.log("initNumber===>"+pos.x,pos.y);
			this._bg.addChild(number);
			this._arrAllSprite.push(number);
			if(arrGroupNumber[i] == this._hideValue){
				number.setOpacity(0);
			}
		}
	},
	//把一个正常顺序的数组 逆转 n 次  得到一个新的数组
	createGroupRndNumberArr:function(){
		var rnd = utils.getRandom(100, 1000);
		var count = 0;

		var arrCur = this._arrAim.slice(0);
		while(1){
			if(count == rnd){
				return arrCur;
			}
			var index = this.getWriteSpriteIndex(arrCur);
			var arr = this.getArr(index);
			var dir = utils.getRandom(0, 3);
			if(arr[dir] != -1){
				arrCur[index] = arrCur[arr[dir]];
				arrCur[arr[dir]] = this._hideValue;
			}
			count++;
		}
	},
	//刷新精灵
	refreshSprite:function(){
		//removeAllItem
		var len = this._arrAllSprite.length;
		arrayUtils.removeAllItems(this._arrAllSprite, true);
		this._arrAllSprite = []
		for(i = 0;i < len;i++){
			var pos = this._arrStartPos[i];			
			var name = this._arrBigPicture[this._levelCount];
			var number = new cc.Sprite(name,this._rect[this._curArr[i]]);
			number.setPosition(pos);
			this._bg.addChild(number);
			this._arrAllSprite.push(number);
			if(this._curArr[i] == this._hideValue){
				number.setVisible(false);
			}
		}
		this._stepsValue++;
	},
	//刷新时间和步数
	refreshTimeGrade:function(){
		this._steps.setString(this._stepsValue);
	},
	showAllSprite:function(){
		var len = this._arrAllSprite.length;
		for(i = 0;i < len;i++){
			var number = this._arrAllSprite[i];
			number.setVisible(true);
		}
	},
	//初始化提示图
	initTipImage:function(bg){
		var size = bg.getContentSize();
		
		
		var name = "res/sprite/ninepluzz/PT-6412_0015_shengzi.png";
		var shenzi = new cc.Sprite(name);
		shenzi.setAnchorPoint(0.5,1);
		shenzi.setPosition(size.width*0.5,size.height*0.03);
		bg.addChild(shenzi);
		
		var size = shenzi.getContentSize();
		var name = "res/sprite/ninepluzz/PT-6412_xiaokuan.png";
		var xiaokuang = new cc.Sprite(name);
		xiaokuang.setAnchorPoint(0.5,1);
		xiaokuang.setPosition(size.width*0.5,size.height*0.5);
		shenzi.addChild(xiaokuang);
		
		//时间步数
		var size = xiaokuang.getContentSize();
		var name = "res/sprite/ninepluzz/PT-6412_zimu.png";
		var timeBg = new cc.Sprite(name);
		timeBg.setAnchorPoint(0,0.5);
		timeBg.setPosition(size.width*0.37,size.height*0.5);
		xiaokuang.addChild(timeBg);
		
		//tishitu
		var size = xiaokuang.getContentSize();
		var name = this._arrBigPicture[this._levelCount];
		var number = new cc.Sprite(name);
		number.setScale(0.27);
		number.setAnchorPoint(1,0.5);
		number.setPosition(size.width*0.33,size.height*0.55);
		xiaokuang.addChild(number);
		this._tipNumber = number;
		
//		this._tipNumber.setTexture(this._arrBigPicture[1]);
		
		//增加时间
		var size = timeBg.getContentSize(); 
		var width = size.width*0.45;
		var height = size.height*0.7;
		var time = new cc.LabelTTF("0","Arial",60);
		time.setAnchorPoint(0,0.5);
		time.setPosition(width,height);
		timeBg.addChild(time);
		this._time = time;
		
		//增加步数
		var size = timeBg.getContentSize(); 
		var steps = new cc.LabelTTF("0","Arial",60);
		steps.setAnchorPoint(0,0.5);
		steps.setPosition(width,size.height - height*1.1);
		timeBg.addChild(steps);
		this._steps = steps;
		
//		var name = "res/sprite/ninepluzz/PT-6411_0012_tiam.png";
//		var number = new cc.Sprite(name);
//		number.setAnchorPoint(0,0.5);
//		number.setPosition(this._size.width*0.42,this._size.height*0.1);
//		this._bg.addChild(number);
		
	},
	// 判断是否有解
	isSolution:function(arr){
		//目标数组的值
		var aimInver = this.getInversionNumber(this._arrAim);
		var curInver = this.getInversionNumber(arr);

		cc.log("==>aimInver="+aimInver,"==>curInver="+curInver);
		if(aimInver%2 == curInver%2){
			return true;
		}
		return false;
	},
	isFinish:function(){
		var len = this._arrAim.length;
		for(var i = 0;i < len;i++){
			cc.log("==>",len,this._arrAim[i],this._curArr[i]);
			if(this._arrAim[i] != this._curArr[i]){
				return false
			}
		}
		return true;
	},
	getInversionNumber:function(array)
	{
		for(var k = 0;k < array.length;k++){
			cc.log("===>createGroupRndNumber="+array[k]);
		}
		var sun = 0;
		for ( var i = 0 ; i < 8 ; i ++)
		{
			for ( var j = 0 ; j < 9 ; j ++)
			{
				if (array[j] != 0)
				{
					if (array[j] == i +1 )
					break;
					if (array[j] < i + 1)
					sun++;
				}
			}
		}
		return sun;
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
		var index = this.getWriteSpriteIndex(this._curArr);
		var dir = this._curCollosionSpirte._dir;
		var arr = this.getArr(index);
		this._curArr[index] = this._curArr[arr[dir]];
		this._curArr[arr[dir]] = this._hideValue;
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
	//与可以碰撞的精灵是否发生判断
	getCheckCollosion:function(worldPos){
		var index = this.getWriteSpriteIndex(this._curArr);
		var arr = this.getArr(index);
		cc.log("===>"+index);
		var  len = arr.length;
		var nodePos = this._bg.convertToNodeSpace(worldPos);
		for(var i = 0;i < len;i++){
			if(arr[i] != -1){
				var sprite = this._arrAllSprite[arr[i]];
				var rect = sprite.getBoundingBox();
				if(cc.rectContainsPoint(rect, nodePos)){
					sprite._dir = i;
					return sprite;
				}
			}
		}
		return false;
	},
	getWriteSpriteIndex:function(arr){
		var len = arr.length;
		for(var i = 0;i < len;i++){
			var value = arr[i];
			if(value == this._hideValue){
				return i;
			}
		}
		return -1
	},
	getArr:function(i){
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
	
	//初始化结束界面
	showGameEnd:function(){
		var winSize = cc.director.getVisibleSize();
		//遮罩
		var layer = cc.LayerColor(cc.color(82, 82, 82, 170));
		layer.setTag(GameNinePuzzleLayer.Tag.EndLayer);
		this.addChild(layer,GameNinePuzzleLayer.ZOlder.EndLayer);
		this._bgLayer = layer;

		var endBg = new cc.Sprite("res/sprite/ninepluzz/PT-6412_bg.png");
		endBg.setPosition(winSize.width*0.5,winSize.height*0.5);
		layer.addChild(endBg);
		endBg.setScale(0.8);
		
		this.initCat(endBg);
		
		var size = endBg.getContentSize();
		
		//重新玩
		var width = size.width*0.35;
		var height = size.height*0.15;
		var backButton = new ccui.Button();
		backButton.setTouchEnabled(true);
		backButton.setPressedActionEnabled(true);
		backButton.loadTextures("res/button/ninepuzzle/PT-6411_chongwang.png","res/button/ninepuzzle/PT-6411_chongwang.png","");
		backButton.addTouchEventListener(this.onTouchEndLayer,this);
		backButton.setTag(GameNinePuzzleLayer.Tag.ReStart);
		backButton.setPosition(cc.p(width,height));
		endBg.addChild(backButton);
		
		//下一关
		var backButton = new ccui.Button();
		backButton.setTouchEnabled(true);
		backButton.setPressedActionEnabled(true);
		backButton.loadTextures("res/button/ninepuzzle/PT-6412_xiayiguan.png","res/button/ninepuzzle/PT-6412_xiayiguan.png","");
		backButton.addTouchEventListener(this.onTouchEndLayer,this);
		backButton.setTag(GameNinePuzzleLayer.Tag.NextLevel);
		backButton.setPosition(cc.p(size.width - width,height));
		endBg.addChild(backButton);
		
	},
	initCat:function(bg){
		var size = bg.getContentSize();
		var cat = StudioUtils.playStudioAnimation("res/studio/duicuo/VM-dadui.json");
		cat.setPosition(size.width*0.5,size.height*0.3);
		bg.addChild(cat);
		
	},
	onTouchEndLayer:function(sender, type){
		if(type==ccui.Widget.TOUCH_ENDED){
			var tag = sender.getTag();
			sender.setTouchEnabled(false);
			switch(tag){
			case GameNinePuzzleLayer.Tag.ReStart:
				this.resetGame();
				break;
			case GameNinePuzzleLayer.Tag.NextLevel:
				if(!missionPaymentManager.isPay(this.getTag())){
					this._freecount = 0;
					return;
				}
				this._levelCount++;
				if(this._levelCount >= GameNinePuzzleLayer.LevelSum){
					this._levelCount = 0;
				}
				this.resetGame();
				break;
			}
		}
	},
	//重新开始
	resetGame:function(){
		this.removeChildByTag(GameNinePuzzleLayer.Tag.EndLayer);
		this.initListener();
		
		this._timeValue = 0;
		this._stepsValue = 0;
		
		this.refreshTimeGrade();
		
		this._tipNumber.setTexture(this._arrBigPicture[this._levelCount]);
		
		this.initNumber();
	},
	update:function(f){
		
	},
	toucheEevent:function(sender, type){
		if(type==ccui.Widget.TOUCH_ENDED){
			if(this._isClickBtns == false){
				return;
			}
		}
	},
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
	}

});

GameNinePuzzleLayer.ZOlder = {
	EndLayer:100,	
},
GameNinePuzzleLayer.Tag = {
		ReStart:1,
		NextLevel:2,
		EndLayer:100
},
GameNinePuzzleLayer.NumSum = 9;
//定义N*N矩阵
GameNinePuzzleLayer.MatrixN = 3;
GameNinePuzzleLayer.LevelSum = 10;