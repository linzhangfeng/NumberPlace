/**通用工具*/
var CU=CU||{};

/**播放音效*/
CU.playerEffect=function(url){
	if(GS.sound){
		var s = cc.audioEngine.playEffect(url);
	}
}