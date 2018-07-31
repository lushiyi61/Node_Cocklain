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
        [CM_CARDPATTERN.CP_NIU0, 1],
        [CM_CARDPATTERN.CP_NIU1, 1],
        [CM_CARDPATTERN.CP_NIU2, 1],
        [CM_CARDPATTERN.CP_NIU3, 1],
        [CM_CARDPATTERN.CP_NIU4, 1],
        [CM_CARDPATTERN.CP_NIU5, 1],
        [CM_CARDPATTERN.CP_NIU6, 1],

        [CM_CARDPATTERN.CP_NIU7, 2],
        [CM_CARDPATTERN.CP_NIU8, 2],
        [CM_CARDPATTERN.CP_NIU9, 2],

        [CM_CARDPATTERN.CP_NIUNIU, 3],
        [CM_CARDPATTERN.CP_HULU, 3],
        [CM_CARDPATTERN.CP_SHUNZI, 3],
        [CM_CARDPATTERN.CP_TONGHUA, 3],

        [CM_CARDPATTERN.CP_YINNIU, 4],

        [CM_CARDPATTERN.CP_ZHADAN, 5],
        [CM_CARDPATTERN.CP_TONGHUASHUN, 5],

        [CM_CARDPATTERN.CP_5XIAONIU, 6],
        [CM_CARDPATTERN.CP_5HUANIU, 7],
    ])
}

