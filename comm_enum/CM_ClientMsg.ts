
// 客户端发出的消息
export const enum E_CLIENT_MSG {
    EC_SNATCHBANKER = 10,	// 抢庄	TReqSnatchbanker
    EC_CHOOSESCORE,	        // 叫分 TReqChooseScore
    EC_SELLSCORE,	        // 卖分	TReqSellScore
    EC_BUYSCORE,	        // 买分	TReqBuyScore
    EC_GETGAMEDATA,	        // 断线重连取游戏数据
};