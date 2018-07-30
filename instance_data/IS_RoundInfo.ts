




/**
 * 玩家数据类
 */
export class IS_RoundInfo {
    flag: number;        // 回合 标志
    number: number;      // 回合 更新计次

    constructor() {
        this.flag = 0;
        this.number = 0;
    };

    Update(flag: number): void {
        this.number += 1;
        this.flag = flag;
    };

    CheckFlag(flag: number): Boolean {
        if (flag == this.flag) {
            return true;
        }
        return false;
    }



    // handCard: Number[]; // 手牌
    // snatchbankerMutiple: Number = -1; // 抢庄倍数
    // baseScore: Number = -1; // 叫分
    // sellScore: Number = -1; // 卖分
    // buyScore: Number = -1;  // 买分

    // bHasSnatchbanker = false; // 已抢庄
    // bBanker = false; // 庄家

    // bHasChooseBaseScore = false; // 已叫分
    // uiBaseScore = 0; // 叫分

    // uiSellScore = 0; // 卖分
    // uiSellToChairIdx = 0; // 买家座椅号

    // mapBuyScore = new Map;	// 买分记录

    // arrNiuCards = new Array(3);	// 3张牛牌

    // iGainScore = 0;



};