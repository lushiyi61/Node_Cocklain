import { CM_CARDPATTERN } from "../comm_enum/CM_CardPattern";
import { CM_ROUNDFLAG } from "../comm_enum/CM_RoundFlag";

export class GameConf {
    // 买卖分种类
    arrSellBuyScore: number[] = [20, 50, 100, 200];

    // 每种状态时间
    mapTimeout: Map<number, number> = new Map([
        [CM_ROUNDFLAG.GAME_SNATCHBANKER, 8],
        [CM_ROUNDFLAG.GAME_CHOOSESCORE, 8],
        [CM_ROUNDFLAG.GAME_SELLBUYSCORE, 12],
    ]);

    // 赔率
    mapOdds: Map<number, number> = new Map([
        [CM_CARDPATTERN.CP_Niu0, 1],
        [CM_CARDPATTERN.CP_Niu1, 1],
        [CM_CARDPATTERN.CP_Niu2, 1],
        [CM_CARDPATTERN.CP_Niu3, 1],
        [CM_CARDPATTERN.CP_Niu4, 1],
        [CM_CARDPATTERN.CP_Niu5, 1],
        [CM_CARDPATTERN.CP_Niu6, 1],

        [CM_CARDPATTERN.CP_Niu7, 2],
        [CM_CARDPATTERN.CP_Niu8, 2],
        [CM_CARDPATTERN.CP_Niu9, 2],

        [CM_CARDPATTERN.CP_Niuniu, 3],
        [CM_CARDPATTERN.CP_Hulu, 3],
        [CM_CARDPATTERN.CP_Shunzi, 3],
        [CM_CARDPATTERN.CP_Tonghua, 3],

        [CM_CARDPATTERN.CP_YinNiu, 4],

        [CM_CARDPATTERN.CP_Zhadan, 5],
        [CM_CARDPATTERN.CP_Tonghuashun, 5],

        [CM_CARDPATTERN.CP_5XiaoNiu, 6],

        [CM_CARDPATTERN.CP_5HuaNiu, 7],
    ])
}

