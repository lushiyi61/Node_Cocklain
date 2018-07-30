import { GM_GameData } from "../game_data/GM_GameData";
import { CM_ROUNDFLAG } from "../comm_enum/CM_RoundFlag";
import { tarsLogs } from "@tars/logs";
var logger = new tarsLogs('TarsDate');


/**
 * 处理游戏开始
 * ========================
 * @param gameData 该桌数据
 * @param listUser 玩家列表
 */
export function handleGameStart(gameData: GM_GameData, listUser: number[]) {
    gameData.GameStart(listUser);
    gameData.roundInfo.Update(CM_ROUNDFLAG.GAME_SNATCHBANKER);
    // 每人发4张牌
    gameData.userMng.listUserInfo.map(userInfo => {
        userInfo.arrCards.push(...gameData.cardInfo.DrawCard(4));
    })
}

/**
 * 处理玩家抢庄
 * ========================
 * @param gameData 该桌数据
 * @param chairIdx 座位序号
 * @param multiple 倍数
 */
export function handleSnatchbanker(gameData: GM_GameData, chairIdx: number, multiple: number): number {

    // 需校验

    // 更新抢庄
    gameData.userMng.UpdateUserSnatchbanker(chairIdx, multiple);

    return 0;
}

/**
 * 处理玩家选底分
 * ========================
 * @param gameData 该桌数据
 * @param chairIdx 座位序号
 * @param score 分数
 */
export function handleChooseScore(gameData: GM_GameData, chairIdx: number, score: number): number {

    // 需校验

    // 更新抢庄
    gameData.userMng.UpdateUserChooseScore(chairIdx, score);

    return 0;
}

/**
 * 处理玩家卖分
 * ========================
 * @param gameData 该桌数据
 * @param chairIdx 座位序号
 * @param score 卖的分数
 */
export function handleSellSocre(gameData: GM_GameData, chairIdx: number, score: number): number {
    
    return 0;
}

/**
 * 处理玩家买分
 * @param gameData 该桌数据
 * @param chairIdx 座位序号
 * @param chairIdxFrom 卖家座位号
 */
export function handleBuySocre(gameData: GM_GameData, chairIdx: number, chairIdxFrom: number): number {
    return 0;
}




/**
 * 游戏（正常/超时）进入下一个环节
 * ========================
 * @param gameData 
 */
export function handleGameAction(gameData: GM_GameData) {

    switch (gameData.roundInfo.flag) {
        case CM_ROUNDFLAG.GAME_SNATCHBANKER:     // 抢庄
            break;
        case CM_ROUNDFLAG.GAME_CHOOSESCORE:        // 选分
            break;
        case CM_ROUNDFLAG.GAME_SELLBUYSCORE:      // 买卖分
            break;
        default:
            logger.error("handleGameAction:the flag is error,flag is ", gameData.roundInfo.flag);
    }
}







/////////////////////////////////////////内部函数/////////////////////////////////////////////////