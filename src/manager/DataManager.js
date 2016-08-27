/*
作者：linzhangfeng
描述：管理得分，最高纪录，最高分数
*/
var DataManager = cc.extend({
    _className:"DataManager",
    ctor:function(){
        this._super();
    },
    /*
    描述：储存最高分数
    */
    saveBaseScore: function (score) {
        var highestScore = this.getHighestRecord();
        if(highestScore < score){
            cc.log(this._className+"==>刷新纪录==》新记录为："+ score + ".老记录："+ highestScore );
            cc.sys.localStorage.setItem(DataManager.Config.HighestRecord,score);
        }
    },
    /*
     描述：得到最高分数
     */
    getHighestRecord: function () {
        return cc.sys.localStorage.getItem(DataManager.Config.HighestRecord);
    },
});
DataManager.Config = {
    HighestRecord:"HighestRecord",
}
/**
 * 获取SoundManager类的唯一实例对象
 */

DataManager.s_pDataManager = null;
DataManager.getInstance = function () {
    if (!DataManager.s_pDataManager) {
        DataManager.s_pDataManager = new DataManager();
    }
    return DataManager.s_pDataManager;
}
var dataManager = DataManager.getInstance();
