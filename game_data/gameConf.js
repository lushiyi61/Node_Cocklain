

var CocklainStruct = require("../tars/CocklainStructTars").CocklainStruct;

var GameConf = {
    // 买卖分种类
    arrSellBuyScore : [20,50,100,200],

    // 每种状态时间
    mapStatusCoundown : new Map([
        [CocklainStruct.E_GAME_STATUS.GS_SendCard, 4],
        [CocklainStruct.E_GAME_STATUS.GS_Snatchbanker, 8],
        [CocklainStruct.E_GAME_STATUS.GS_ChooseBaseScore, 8],
        [CocklainStruct.E_GAME_STATUS.GS_ScoreSellBuy, 12],
        [CocklainStruct.E_GAME_STATUS.GS_SendLastCard, 8],
    ]),
    
    // 赔率
    mapOdds : new Map([
        [ CocklainStruct.E_CARD_PATTERN.CP_Niu0, 1],
        [ CocklainStruct.E_CARD_PATTERN.CP_Niu1, 1],
        [ CocklainStruct.E_CARD_PATTERN.CP_Niu2, 1],
        [ CocklainStruct.E_CARD_PATTERN.CP_Niu3, 1],
        [ CocklainStruct.E_CARD_PATTERN.CP_Niu4, 1],
        [ CocklainStruct.E_CARD_PATTERN.CP_Niu5, 1],
        [ CocklainStruct.E_CARD_PATTERN.CP_Niu6, 1],

        [ CocklainStruct.E_CARD_PATTERN.CP_Niu7, 2],
        [ CocklainStruct.E_CARD_PATTERN.CP_Niu8, 2],
        [ CocklainStruct.E_CARD_PATTERN.CP_Niu9, 2],

        [ CocklainStruct.E_CARD_PATTERN.CP_Niuniu, 3],
        [ CocklainStruct.E_CARD_PATTERN.CP_Hulu, 3],
        [ CocklainStruct.E_CARD_PATTERN.CP_Shunzi, 3],
        [ CocklainStruct.E_CARD_PATTERN.CP_Tonghua, 3],

        [ CocklainStruct.E_CARD_PATTERN.CP_YinNiu, 4],

        [ CocklainStruct.E_CARD_PATTERN.CP_Zhadan, 5],
        [ CocklainStruct.E_CARD_PATTERN.CP_Tonghuashun, 5],

        [ CocklainStruct.E_CARD_PATTERN.CP_5XiaoNiu, 6],

        [ CocklainStruct.E_CARD_PATTERN.CP_5HuaNiu, 7],
    ])
}

module.exports = GameConf;
