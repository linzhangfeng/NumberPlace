
stringUtils={
		
	//给int转string的方法 补位 10转4位int 变为 0010
		//num 为数字  n为个数
		//返回0或补位后的字符串
		formateIntToString:function(num,n){
			var tbl = [];
			return (0 >= (n = n-num.toString().length)) ? num : (tbl[n] || (tbl[n] = Array(n+1).join(0))) + num;
		},

};

utils = {
		//随机数	[min,max);
		getRandom:function(min,max){

			if(max<min){
				var temp = max;
				max = min;
				min = temp;
			}
			var range = max-min;
			var rand = Math.random();

			return min + Math.round(rand * range);
		},	
		getRandomIncludeBothSides:function(min,max){
			if(max<min){
				var temp = max;
				max = min;
				min = temp;
			}
			var range = max-min;
			var rand = Math.random();

			return min + Math.round(rand * range);
		},
		//随机数	
		//@start 开始数字
		//@length 长度;
		getRandomWithLength:function(start,length){
			var range = length-1;
			var rand = Math.random();
			return start + Math.round(rand * range);
		},
		//得到[min,max)中，除了one以外的随机数
		getRandomWithoutOne:function(min,max,one){
			var rnd = min;
			do{
				rnd = utils.getRandom(min,max);
			}while(one==rnd);
			return rnd;
		},
		getRandomWithoutTwo: function(min,max,one,two){
			var rnd = min;
			do{
				rnd = utils.getRandom(min,max);
			}while(one==rnd || two==rnd);
			return rnd;
		},
		//得到[min,max)中，除了one以外的随机数
		getRandomWithoutArray:function(min,max,array){
			var rnd = min;
//			do{
//				rnd = utils.getRandom(min,max);
//			}while(one==rnd);
			while(1){
				rnd = utils.getRandom(min,max);
				var i=0;
				for(;i<array.length;i++){
					if(rnd==array[i]){
						break;
					}
				}
				if(i==array.length)
					break;
			}
			return rnd;
		},
		log:function(value){
			var str =value+" ";
			cc.log(str+value);
		},
		/**
		 * 以bg x中心, 确定当前node应该的显示位置 
		 * @param {x} 所有node的以哪个坐标为中心 布局.
		 * @param {index} 当前node在所有node中的index
		 * @param {total} 所有node的个数
		 * @param {space} node与node之间的间距
		 */
		getPositionXbyCentrePos:function(x,index,total,space){

			var xOff = space;//每个之间的间距
			var count = index;
			//算法太2 byzzk  x以屏幕中心 平分布局 
			if(total%2==0){
				if(count<total/2){//left
					newx = x-((total/2)-count-1)*2*xOff-xOff;	
				}else{//right
					newx = x+(count-(total/2))*2*xOff+xOff;
				}

			}else{

				var midNum = parseInt(total/2);
				if(count<midNum){
//					if(count!=0)
						newx = x-(midNum-count)*2*xOff;
//					else
//						newx = x-((midNum-count)*2-1)*xOff;

				}else if(count==midNum){
					newx = x;
				}else{//right
//					if(count!=total-1)
						newx = x+(count-midNum)*2*xOff;
//					else
//						newx = x+((count-midNum)*2 -1 )*xOff;
				}
			}
			return newx;
		},
		
		getPositionYbyCentrePos:function(centerY,index,total,space){		
			
			if(total%2==0){	//复数
				var y = (centerY + space/2) + (total*space)/2 - (index+1)*space;
			}else{			//单数
				var y = centerY + (total*space)/2 - (index+1)*space;
			}		
			return y;
		},
		

		/**
		 * 判断该文件是否存在
		 */
		isFileExist:function(fileName){
			cc.log("=====>isFileExist"+cc.sys.platform,cc.sys.BROWSER_TYPE_CHROME);
			if (utils.isUseHtml5){
				return true;
			}
			if(jsb.fileUtils.isFileExist(fileName)){
				return true;

			}else{
//				cc.error("file: utils line:111  file does not exist %s",fileName);
				return false;
			}
		},
		/**
		 * 判断用户是否再用html5
		 */
		isUseHtml5: function () {
			cc.log("===>curPlatform="+cc.sys.platform);
			if (cc.sys.platform == 101){
				return true;
			}
			return false;
		}
};

arrayUtils ={
		//删除所有元素
		removeAllItems:function(array,isFromParent){
			if(!array||array==0){
				return;
			}
			var isFromParent = isFromParent||false;
			do{
				var item = array.shift();
				if(isFromParent&&item){
					cc.log("item "+item);
					item.removeAllChildren(true);
					item.removeFromParent(true);
					cc.log("item "+item);
					item=0;
			}	
		}while(array.length>0);
	},
	//得到item的index
	indexOf: function(array,item) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] == item) return i;
		}
		return -1;
	},
	removeItem:function(array,item,isRemoveFromParent) {
		var index = array.indexOf(item);
		if (index > -1) {
			array.splice(index, 1);
			if(isRemoveFromParent){
				item.removeFromParent();
			} 
		}
		return null;
	},
	removeItemByIndex:function(array,index) {
		if(!array||array.length<=index||index<0){
			return ;
		}
		array.splice(index, 1);
	},
	//随机打乱 数字下标数组
	resetArray:function(array){
		for(var i=0;i<array.length*2;i++){
			var rnd1 = utils.getRandom(0,array.length-1 );
			var rnd2 = utils.getRandom(0,array.length-1 );
			var temp = array[rnd1];
			array[rnd1] = array[rnd2];
			array[rnd2] = temp;
		}
	},
	
	//输出数字下标数组所有元素
	logArray:function(array){
		for(var i=0;i<array.length;i++){
			cc.log("array item "+i+" "+array[i]);
		}
	},
	//给array添加num个同样的item
	pushWithNum:function(array,item,num){
		if(!array||!item||num<0){
			return ;
		}
		for(var i = 0;i<num;i++){
			array.push(item.copy());
		}
		arrayUtils.logArray(array);
	},
	//输出数字下标数组所有元素
	logArray:function(array){
		for(var i=0;i<array.length;i++){
			cc.log("array item "+i+" "+array[i]);
		}
	},
	//数组的值从小到大排序
	arrayValueSort:function(arr){
		for(var i = 0;i < arr.length - 1;i++){
			for(var k = i+1;k < arr.length;k++){
				if(arr[i] > arr[k]){
					var value = arr[i];
					arr[i] = arr[k];
					arr[k] = value;
				}
			}
		}
	}
};

actionUtils= {
	//左右晃动
		errorAction: function(goods) {
			//cc.audioEngine.playEffect("res/sounds/test/sound_error.ogg");
			var size = cc.director.getWinSize();

			var time = time||0.5;

			var dis = utils.getRandom(1, 3)/100;

			var action1 = cc.moveBy(time, size.width * dis, 0);
			var action2 = cc.moveBy(time, size.width * -dis*2, 0);
			var target = this;
			var seq = cc.sequence(action1, action2, 
					action2.reverse(), action2.clone(),action2.clone().reverse(), 
					action1.reverse(),cc.callFunc(function() {
						//target._touched = false;
					}, goods));
//			var array = [action1, action2, 
//			action2.reverse(), action2.clone(),action2.clone().reverse(), 
//			action1.reverse()];
//			goods.runAction(seq);
			return seq;
	},	
		
	rightAction: function(goods) {
		cc.audioEngine.playEffect("res/sounds/test/sound_right.mp3");
		var size = cc.director.getWinSize();
		var action1 = cc.jumpTo(1, cc.p(size.width * 0.53, size.height * 0.72), 
				size.height * 0.40, 1); 
		var action2 = cc.scaleTo(1, 0);
		//var action3 = cc.repeatForever(cc.rotateBy(2, 360));
		//var action3 = cc.rotateBy(1, 360);
		var spa = cc.spawn(action1, action2);
		var target = this;
		var callfunc = false;
		
		var action = cc.scaleTo(0.3, 1.2);
		
		//if(node&&callback)
		//	callfunc = 
		var seq = cc.sequence(action,cc.delayTime(1),spa, cc.callFunc(function() {
			var particle = new cc.ParticleSystem("res/particle/boxParticle.plist");  
			particle.setNormalizedPosition(cc.p(0.53, 0.82));
			goods.getParent().addChild(particle, 2);

			goods.setScale(1);
			goods.setVisible(false);
		}, goods));
		goods.runAction(seq); 
	}, 	
	tipAction:function(type,parent,tag){
		//var size = cc.director.getWinSize();
		var tip = new Tip(type,tag);
		tip.setNormalizedPosition(cc.p(0.5,0.5));

		parent.addChild(tip,GameConfig.MENU_ZODER.MENU_TIP);
	},
	guangEffect:function(bg,size){
		
		var size = size||false;
		
		if(!size){
			size = bg.getContentSize();
		}
		var up = cc.Sprite("res/frameworkRes/effect/ui__0002_upLight.png");
		up.setPosition(size.width*0.5,size.height*0.5);
		bg.addChild(up,-100);
		
		var down = cc.Sprite("res/frameworkRes/effect/ui__0003_baseLight.png");
		down.setPosition(size.width*0.5,size.height*0.5);
		bg.addChild(down,-100);
		
		var time = 0.3;
		var action1 = cc.repeatForever(cc.rotateBy(time,30));
		up.runAction(action1);
		
		var action2 = cc.repeatForever(cc.rotateBy(time,-45));
		down.runAction(action2);
	},
	getActionByFrame:function(name, num, speed, type){
		var animFrames = [];
		for (var i = 1; i <= num; i++) {
			var str = name + i + ".png";
			var frame = cc.spriteFrameCache.getSpriteFrame(str);
			animFrames.push(frame); 
		}
		var animation = new cc.Animation(animFrames, speed);
		if(type)
			animation.setRestoreOriginalFrame(true);
		var action = cc.Animate.create(animation);
		return action;
	}
};