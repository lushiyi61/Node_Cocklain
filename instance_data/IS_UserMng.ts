import _ = require("../node_modules/@types/lodash");





/**
 * 玩家数据管理类
 */
export class IS_UserMng {
    listUserInfo: IS_UserInfo[];    // 当前座位上的玩家信息

    constructor() {

    }


    /**
     * 初始化座位上的玩家信息
     * ======================================
     * @param listUser 
     */
    InitUserInfo(listUser: number[]) {
        this.listUserInfo = [];
        listUser.map(user => {
            let userInfo = new IS_UserInfo(user);
            this.listUserInfo.push(userInfo);
        })
    }

    /**
     * 更新指定玩家抢庄倍数
     * @param chairIdx 座位序号
     * @param multiple 倍数
     */
    UpdateUserSnatchbanker(chairIdx: number, multiple: number) {
        this.listUserInfo[chairIdx].hasSnatchbanker = true;
        this.listUserInfo[chairIdx].snatchbankerMutiple = multiple;
    }

    CheckSnatchbanker(): boolean {
        let tmplist = _.filter(this.listUserInfo, userInfo => { return userInfo.hasSnatchbanker == false });
        if (tmplist.length > 0) {
            return false;
        }
        return true;
    }

};


/**
 * 当前局内有效玩家数据
 */
export class IS_UserInfo {
    constructor(userID: Number) {
        this.userID = userID;
    }

    userID: Number; // 玩家ID
    arrCards: Number[] = [];		// 5张牌
    hasSnatchbanker: Boolean = false;       // 已抢庄
    snatchbankerMutiple: Number = 0;        // 抢庄倍数
    hasChooseBaseScore: Boolean = false;    // 已叫分
    baseScore: Number = 0; // 叫分
    sellScore: Number = 0; // 卖分
    sellToChairIdx: Number = 0; // 买家座椅号

    mapBuyScore = new Map;	// 买分记录
    chairIdxeCardPattern = 0;
    niuCards = new Array(3);	// 3张牛牌
    gainScore = 0;

}