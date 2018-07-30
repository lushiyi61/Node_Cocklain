import _ = require("lodash");





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
     * ======================================
     * @param chairIdx 座位序号
     * @param multiple 倍数
     */
    UpdateUserSnatchbanker(chairIdx: number, multiple: number) {
        this.listUserInfo[chairIdx].hasSnatchbanker = true;
        this.listUserInfo[chairIdx].snatchbankerMutiple = multiple;
    }


    /**
     * 更新指定玩家抢分
     * ======================================
     * @param chairIdx 座位序号
     * @param score 分数
     */
    UpdateUserChooseScore(chairIdx: number, score: number) {
        this.listUserInfo[chairIdx].hasChooseScore = true;
        this.listUserInfo[chairIdx].chooseScore = score;
    }

    /**
     * 更新玩家卖分
     * ======================================
     * @param chairIdx 座位序号
     * @param score 分数
     */
    UpdateUserSellSocre(chairIdx: number, score: number) {
        this.listUserInfo[chairIdx].sellScore = score;
    }


    /**
     * 更新玩家买分
     * ======================================
     * @param chairIdx 买家
     * @param chairIdxFrom 卖家
     */
    UpdateUserBuySocre(chairIdx: number, chairIdxFrom: number) {
        this.listUserInfo[chairIdxFrom].hasSell = true;
        this.listUserInfo[chairIdx].listBuyScore.push(chairIdxFrom);
    }

    /**
     * 检查是否全部选择了抢庄
     * ======================================
     */
    CheckSnatchbanker(): boolean {
        let tmplist = _.filter(this.listUserInfo, userInfo => { return userInfo.hasSnatchbanker == false });
        if (tmplist.length > 0) {
            return false;
        }
        return true;
    }

    /**
     * 检查是否全部选择了底分
     * ======================================
     */
    CheckChooseScore(): boolean {
        let tmplist = _.filter(this.listUserInfo, userInfo => { return userInfo.hasChooseScore == false });
        if (tmplist.length > 0) {
            return false;
        }
        return true;
    }

    /**
     * 校验该玩家座位号是否不存在
     * ======================================
     * @param chairIdx 
     */
    CheckUserLegal(chairIdx: number): boolean {
        if (chairIdx < 0 || chairIdx >= this.listUserInfo.length) {
            return false;
        }
        return true;
    }

    /**
     * 校验当前玩家是否可以抢庄
     * ======================================
     * @param chairIdx 
     */
    CheckUserCanSnatchbanker(chairIdx: number): boolean {
        if (this.listUserInfo[chairIdx].hasSnatchbanker) {
            return false;
        }
        return true;
    }

    /**
     * 校验当前玩家是否可以选分
     * ======================================
     * @param chairIdx 
     */
    CheckUserCanChooseScore(chairIdx: number): boolean {
        if (this.listUserInfo[chairIdx].hasSnatchbanker) {
            return false;
        }
        return true;
    }

    /**
     * 校验当前玩家是否可以卖分
     * ======================================
     * @param chairIdx 
     */
    CheckUserCanSellScore(chairIdx: number): boolean {
        if (this.listUserInfo[chairIdx].sellScore > 0) {
            return false;
        }
        return true;
    }

    /**
     * 校验当前玩家是否可以买
     * ======================================
     * @param chairIdx 
     */
    CheckUserCanBuyScore(chairIdx: number): boolean {
        if (this.listUserInfo[chairIdx].hasSell) {
            return false;
        }
        return true;
    }




};


/**
 * 当前局内有效玩家数据
 */
export class IS_UserInfo {
    constructor(userID: number) {
        this.userID = userID;
    }

    userID: number;                         // 玩家ID
    arrCards: number[] = [];		        // 5张牌
    hasSnatchbanker: boolean = false;       // 是否已抢庄
    snatchbankerMutiple: number = 0;        // 抢庄倍数
    hasChooseScore: boolean = false;        // 是否已叫分
    chooseScore: number = 0;                // 叫分分数
    sellScore: number = 0;                  // 卖分
    hasSell: boolean = false;               // 是否已卖分
    listBuyScore: number[] = [];            // 卖家列表



    mapBuyScore = new Map;	                // 买分记录
    chairIdxeCardPattern = 0;
    niuCards = new Array(3);	// 3张牛牌
    gainScore = 0;
}