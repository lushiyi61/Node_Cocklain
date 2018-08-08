import { IS_RoundInfo } from "./IS_RoundInfo";
import { IS_CardInfo } from "./IS_CardInfo";
import { IS_RuleInfo } from "./IS_RuleInfo";
import { IS_TableInfo } from "./IS_TableInfo";
import { IS_UserMng } from "./IS_UserMng";



/**
 * 游戏数据总成
 */
export class IS_GameData {
    roundInfo: IS_RoundInfo;        // 局内 游戏回合数据
    cardInfo: IS_CardInfo;          // 局内 牌数据
    ruleInfo: IS_RuleInfo;          // 游戏桌 游戏规则
    tableInfo: IS_TableInfo;        // 游戏桌 数据
    userMng: IS_UserMng;            // 玩家数据

    protected constructor(tableType: number, rules: string) {
        this.tableInfo = new IS_TableInfo(tableType);
        this.ruleInfo = new IS_RuleInfo(rules);
        this.userMng = new IS_UserMng();
    }

    GameStart(listUser: number[]) {
        this.roundInfo = new IS_RoundInfo();
        this.cardInfo = new IS_CardInfo();
        this.userMng.InitUserInfo(listUser);
        this.tableInfo.UpdateRound();
        this.tableInfo.UpdateUserInfo(listUser);
    }

    GameOver() {

    }
}