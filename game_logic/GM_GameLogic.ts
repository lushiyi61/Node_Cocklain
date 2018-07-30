import { GM_GameData } from "../game_data/GM_GameData";
import { CM_ROUNDFLAG } from "../comm_enum/CM_RoundFlag";




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