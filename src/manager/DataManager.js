/*
���ߣ�linzhangfeng
����������÷֣���߼�¼����߷���
*/
var DataManager = cc.extend({
    _className:"DataManager",
    ctor:function(){
        this._super();
    },
    /*
    ������������߷���
    */
    saveBaseScore: function (score) {
        var highestScore = this.getHighestRecord();
        if(highestScore < score){
            cc.log(this._className+"==>ˢ�¼�¼==���¼�¼Ϊ��"+ score + ".�ϼ�¼��"+ highestScore );
            cc.sys.localStorage.setItem(DataManager.Config.HighestRecord,score);
        }
    },
    /*
     �������õ���߷���
     */
    getHighestRecord: function () {
        return cc.sys.localStorage.getItem(DataManager.Config.HighestRecord);
    },
});
DataManager.Config = {
    HighestRecord:"HighestRecord",
}
/**
 * ��ȡSoundManager���Ψһʵ������
 */

DataManager.s_pDataManager = null;
DataManager.getInstance = function () {
    if (!DataManager.s_pDataManager) {
        DataManager.s_pDataManager = new DataManager();
    }
    return DataManager.s_pDataManager;
}
var dataManager = DataManager.getInstance();
