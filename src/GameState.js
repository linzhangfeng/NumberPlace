var GS=GS||{};

/**游戏类型*/
GS.gameType=0;//0:入门(不隐藏)；1:中级（隐藏；正确位置显示）;2:高级（隐藏；正确位置不显示）

/**音效开关*/
GS.sound=1;//1为开启，0为关闭

/**存储的最高纪录*/

/**不同难度对应的最低步数*/
GS.steps={
    s0:0,
    s1:0,
    s2:0
};

/**存储的key值*/
GS.LocalStorageKey="gameStateKey";

/**加载存储在本地的信息*/
GS.loadLocalStorage=function(key){
	var ls = cc.sys.localStorage;
	//获取经典模式的信息
	var r = ls.getItem("gameStateKey");
    return r;
};
/**存储本地信息*/
GS.setLocalStorage=function(key,value){
	var ls = cc.sys.localStorage;
	ls.setItem(key, value);
};

/**存储的model对象*/
GS.LocalStorageModel={
    steps:null,//记录
    sound:1 //音效
};