/**移动的买个图块单元*/
var UnitSprite=cc.Sprite.extend({
	gameLayer:null,//GameLayer实例
	index0:0,//初始的索引(0~8)
	index:0,
	w:0,
	h:0,
	hide:false,//是否隐藏
	ctor:function(index,hide,gameLayer){
		this._super();
		
		this.index=this.index0=index;
		this.hide=hide;
		this.gameLayer=gameLayer;
		
		this.init();
	},
	init:function(){
		var num=GameLayer.row;
		this.w=this.width=UnitSprite.width;
		this.h=this.height=UnitSprite.height;
		this.setAnchorPoint(cc.p(0,0));
		
		var img="";
		if(this.index0==8){
			img=res.p_0_png;
		}else{
			img=UnitSprite.boxBgArray[this.index0];
		}
		
		var sp=new cc.Sprite(img);
		var scale=this.w/(sp.width+6);
		sp.attr({
			x: this.w / 2,
			y: this.h / 2,
			scaleX:scale,
			scaleY:scale
		});
		this.addChild(sp);
		
		//绘制矩形
		/*var draw =new cc.DrawNode();
		var points = [ cc.p(0,0), cc.p(this.w,0), cc.p(this.w,this.h), cc.p(0,this.h) ];
		draw.drawPoly(points, cc.color(255,255,255,255), 1, cc.color(0,0,0,255) );
		this.addChild(draw);*/
		
		/**
		var backLayer=new cc.LayerColor(cc.color(0,0,0,1),this.w,this.h);
		this.addChild(backLayer);
		var boxLayer=this.boxLayer=new cc.LayerColor(cc.color(255,255,255,100),this.w-2,this.h-2);
		
		backLayer.addChild(boxLayer);
		boxLayer.x=(backLayer.width-boxLayer.width)/2;
		boxLayer.y=(backLayer.height-boxLayer.height)/2;
		 */

		if(!this.hide){
			/**
			var blockSize = cc.size(this.w, this.h);
			var label=this.label=new cc.LabelTTF(this.index0+1, "Arial", 80, blockSize, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
			this.addChild(label);
			label.x=this.w/2;
			label.y=this.h/2;
			label.color=cc.color(0,0,0,255);
			*/
			
			var img="#"+(this.index0+1)+"n.png";
			var spNum=this.spNum=new cc.Sprite(img);
			spNum.x=this.w/2;
			spNum.y=this.h/2;
			this.addChild(spNum)
		}
		
		//初始化事件
		this.initEvent();
		
		return true;
	},
	/**初始化事件*/
	initEvent:function(){
		var self=this;
		var listener1 = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {

				var target = event.getCurrentTarget();
				var locationInNode = target.convertToNodeSpace(touch.getLocation());
				var s = target.getContentSize();
				var rect = cc.rect(0, 0, s.width, s.height);
				
				if (cc.rectContainsPoint(rect, locationInNode)) {
					//隐藏块
					var hideSp=self.gameLayer.getHideSprite();
					
					if(self.gameLayer.checkMove(target.index,hideSp.index)){

						if(self.gameLayer.gameState!=1){
							self.gameLayer.setButtonSpriteState();
							self.gameLayer.gameState=1;
						}

						GameLayer.checkUnitArray=[];
						GameLayer.checkUnitArray.push(target);//添加第一个选中的单元格

						var preUnit=self.gameLayer.preUnit;
						if(preUnit!=null){
							//preUnit.boxLayer.setColor(UnitSprite.unSelectColor);
						}
						self.gameLayer.preUnit=target;
						
						self.setScaleAndCenter(false);
						//target.boxLayer.setColor(UnitSprite.selectColor);
						return true;
					}
				}
				return false;
			},
			onTouchMoved: function (touch, event) {
				var point=touch.getLocation();

				for(var i=0;i<GameLayer.unitSpriteArray.length;i++){
					var target=GameLayer.unitSpriteArray[i];
					var locationInNode = target.convertToNodeSpace(point);
					var s = target.getContentSize();
					var rect = cc.rect(0, 0, s.width, s.height);
					if (cc.rectContainsPoint(rect, locationInNode)) {
						if(!target.hide){
							if(!GameLayer.checkUnitArray.contains(target)){
								var preSprite=GameLayer.checkUnitArray[GameLayer.checkUnitArray.length-1];
								if(self.gameLayer.checkMove(target.index,preSprite.index)){
									GameLayer.checkUnitArray.push(target);
									target.setScaleAndCenter(false);
									//target.boxLayer.setColor(UnitSprite.selectColor);
								}
							}
						}
					}
				}
			},
			onTouchEnded: function (touch, event) {
				var target = event.getCurrentTarget();
				
				var end=target.gameLayer.getPointByIndex(GameLayer.checkUnitArray[GameLayer.checkUnitArray.length-1].index);
				var hideSpEndP=cc.p(end.x,end.y);
				
				for(var i=0;i<GameLayer.checkUnitArray.length;i++){
					var o=GameLayer.checkUnitArray[i];
					
					o.setScaleAndCenter(1);
					
					o.gameLayer.moveUnitSprite(o);
				}
				
				//隐藏‘隐藏方块’
				var hideSp=self.gameLayer.getHideSprite();
				var action1 = cc.scaleTo(0.035, 0);
				hideSp.runAction(cc.sequence(action1,cc.callFunc(function(){
					hideSp.x=hideSpEndP.x;
					hideSp.y=hideSpEndP.y;
					
					//显示‘隐藏方块’
					var action2 = cc.scaleTo(0.035, 1);
					hideSp.runAction(action2);
				},this)));
				
				if(GS.gameType==1){
					//正确位置显示
					var array=GameLayer.unitSpriteArray;
					for(var i=0;i<array.length;i++){
						var o=array[i];
						if(o.index==o.index0){
							o.showLabel();
						}else{
							o.hideLabel();
						}
					}
				}
				
				//cc.log(GameLayer.checkUnitArray.length);
				CU.playerEffect(res.select_wav);
			}
		});
		
		cc.eventManager.addListener(listener1, this);
	},
	/**显示数字label*/
	showLabel:function(){
		if(this.spNum){
			this.spNum.setVisible(true);
			var action1=cc.scaleTo(0.2,1,1);
			this.spNum.runAction(action1);
		}
	},
	/**隐藏数字label*/
	hideLabel:function(){
		if(this.spNum){
			this.spNum.setVisible(false);
			var action1=cc.scaleTo(0.2,0,0);
			this.spNum.runAction(action1);
		}
	},
	/**缩放并居中
	 * flag:true表示放大；false表示缩小
	 * */
	setScaleAndCenter:function(flag){
		
		if(this.hide){
			return;
		}
		var subW=this.width*(1-UnitSprite.scaleNum)/2;
		var subH=this.height*(1-UnitSprite.scaleNum)/2;
		if(flag){
			this.setScale(1);
			this.x=this.x-subW;
			this.y=this.y-subH;
		}else{
			this.setScale(UnitSprite.scaleNum);
			this.x=this.x+subW;
			this.y=this.y+subH;
		}
	}
});
//常量
UnitSprite.width=-1;
UnitSprite.height=-1;
/**被选中移动时的颜色*/
UnitSprite.selectColor=cc.color(255,255,155,255);
/**未选中时的颜色*/
UnitSprite.unSelectColor=cc.color(255,255,255,255);
/**选中移动时的缩放*/
UnitSprite.scaleNum=0.9;

/**单元块的背景*/
UnitSprite.boxBgArray=[
                       res.p_1_png,
                       res.p_2_png,
                       res.p_3_png,
                       res.p_4_png,
                       res.p_5_png,
                       res.p_6_png,
                       res.p_7_png,
                       res.p_8_png,
                       ];

Array.prototype.contains = function (arr){    
	for(var i=0;i<this.length;i++){//this指向真正调用这个方法的对象  
		if(this[i] == arr){  
			return true;  
		}  
	}     
	return false;  
}  