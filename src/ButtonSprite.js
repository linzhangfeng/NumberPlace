var ButtonSprite=cc.Sprite.extend({
	img1:"",//图片
	img2:"",//按下时的图片
	layer:null,
	onTouchBeganBack:null,//按钮按下去回调
	onTouchEndedBack:null,//按钮抬起回调
	flag:0,//作为标示
	scaleFlag:1,//被缩放的数值
	onTouchEndedFlag:false,//按钮抬起时的响应事件
	infoSprite:null,//按钮上的图片文字
	ctor:function(text,img1,img2,layer,onTouchBeganBack,onTouchEndedBack,flag){
		this._super(img1);
		
		this.img1=img1;
		if(!img2||img2==""){
			this.img2=img1;
		}else{
			this.img2=img2;
		}
		
		this.layer=layer;
		
		if(flag){
			this.flag=flag;
		}
		
		//this.setAnchorPoint(cc.p(0,0));
		if(text&&text!=""){
			var blockSize = cc.size(this.width, this.height);
			var label=this.label=new cc.LabelTTF(text, "Arial", 35, blockSize, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
			this.addChild(label);
			label.x=this.width/2;
			label.y=this.height/2;
			label.color=cc.color(255,255,255,255);
		}
		
		layer.addChild(this);
		this.x=(layer.width-this.width)/2;
		this.y=(layer.height-this.height)/2;
		
		this.onTouchBeganBack=onTouchBeganBack;
		this.onTouchEndedBack=onTouchEndedBack;
		
		//初始化事件
		this.initEvent();
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
					target.setScale(self.scaleFlag+0.1);
					target.setTexture(self.img2);

					if(self.onTouchBeganBack){
						self.onTouchBeganBack(target);
					}
					
					self.onTouchEndedFlag=true;
					return true;
				}
				return false;
			},
			onTouchMoved: function (touch, event) {
				var target = event.getCurrentTarget();
				var locationInNode = target.convertToNodeSpace(touch.getLocation());
				var s = target.getContentSize();
				var rect = cc.rect(0, 0, s.width, s.height);

				if (!cc.rectContainsPoint(rect, locationInNode)) {
					self.onTouchEndedFlag=false;
					
					target.setScale(self.scaleFlag);
					target.setTexture(self.img1);
					
					return false;
				}
			},
			onTouchEnded: function (touch, event) {
				if(self.onTouchEndedFlag){
					CU.playerEffect(res.select_wav);
					var target = event.getCurrentTarget();
					target.setScale(self.scaleFlag);
					target.setTexture(self.img1);
					self.onTouchEndedBack(target);
				}
				
			}
		});

		cc.eventManager.addListener(listener1, this);
	},
	/**设置按钮上的文字*/
	setText:function(text){
		this.label.setString(text);
	},
	/**设置缩放*/
	setScaleXY:function(scale){
		this.scaleFlag=scale;
		this.setScale(scale);
	}
});