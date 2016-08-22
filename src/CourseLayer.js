/**教程*/
var CourseLayer=cc.Layer.extend({
    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        //TODO
        //后期添加图片教程

    	var bgSprite0=new cc.Sprite(res.bg_jpg);
    	bgSprite0.attr({
    		x: winSize.width / 2,
    		y: winSize.height / 2
    	});
    	this.addChild(bgSprite0);
    	
        var bgSprite=new cc.Sprite(res.box_png);
        bgSprite.attr({
            x: winSize.width / 2,
            y: winSize.height / 2
        });
        this.addChild(bgSprite);

        var bgTitle=new cc.Sprite(res.box_title_png);
        bgTitle.attr({
        	x: bgSprite.x,
        	y: bgSprite.y+bgSprite.height/2-bgTitle.height/10
        });
        this.addChild(bgTitle);
        
        var bgBelow=new cc.Sprite(res.sub_ft_png);
        bgBelow.attr({
        	x: bgSprite.x,
        	y: bgBelow.height/2
        });
        this.addChild(bgBelow);
        
        var str=CourseLayer.aboutTitleArray[0];
        var bgType=this.bgTypeSprite=new cc.Sprite(str);
        bgType.attr({
        	x: bgTitle.x,
        	y: bgTitle.y
        });
        this.addChild(bgType);
        
        var layer=this.layer=new cc.LayerColor(cc.color(0, 0, 0, 1),winSize.width,winSize.height);
        layer.x=0;
        layer.y=0;
        this.addChild(layer);
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
        //吞噬后边的事件
        cc.eventManager.addListener(listener1, layer);

        /**
        var about=this.aboutLabel = new cc.LabelTTF("", "Arial", 30, cc.size(bgSprite.width * 0.65, 0), cc.TEXT_ALIGNMENT_LEFT );
        about.attr({
            x: winSize.width / 2,
            y: winSize.height/2+30,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(about);
        */
        
        var glTextSp=this.glTextSp=new cc.Sprite(CourseLayer.glTextArray[0]);
        glTextSp.attr({
        	x: winSize.width / 2,
        	y: winSize.height/2+30,
        	anchorX: 0.5,
        	anchorY: 0.5
        });
        this.addChild(glTextSp);

        var btn=new ButtonSprite("",res.btn_blue_a_png,res.btn_blue_a_png,layer,null,function(){
            this.setVisible(false);
            this.setScale(0.0001);
        }.bind(this));
		btn.x=layer.width/2;
		btn.y=layer.height/5;

		this.setVisible(false);
		this.setScale(0.0001);
		
		var backSp=new cc.Sprite(res.btn_back_png);
		this.addChild(backSp);
		backSp.x=btn.x;
		backSp.y=btn.y;
    },
    /**显示教程信息*/
    show:function(type){
        //type:0,//难度类型：0:入门(不隐藏)；1:中级（隐藏；正确位置显示）;2:高级（隐藏；正确位置不显示）
        this.setScale(1);
        this.setVisible(true);
        this.bgTypeSprite.setTexture(CourseLayer.aboutTitleArray[type]);
        
        this.glTextSp.setTexture(CourseLayer.glTextArray[type]);
        
        //this.aboutLabel.setString(CourseLayer.aboutArray[type]);
    }
});
CourseLayer.aboutArray=[
"A.基础玩法：\n    1》按照顺序将对应1~8数字的方块归为即为胜利。\n    2》只有空白方块四周的方块可以移动（点击一下即可与空白方块互换位置）。\n    ",
"A.基础玩法：\n    1》基础玩法同[入 门]。\n    2》只有出在正确位置上的方块才会显示数字；\n    3》“查看”按钮可以查看隐藏的数字（但是每局有次数限制）。\n    ",
"A.基础玩法：\n    1》基础玩法同[入 门]。\n    2》只有出胜利后方块才会显示数字。\n    3》“查看”按钮可以查看隐藏的数字（但是每局有次数限制）。\n    ",
];
CourseLayer.aboutTitleArray=[
res.cngl_png,
res.gsgl_png,
res.dsgl_png
];

CourseLayer.glTextArray=[
res.gl_text_png,
res.gs_text_png,
res.ds_text_png
];