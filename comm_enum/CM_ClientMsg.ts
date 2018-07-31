
// 客户端发出的消息
export class CM_CLIENTMSG {
    static readonly EC_SNATCHBANKER    = 10;	        // 抢庄	TReqSnatchbanker
    static readonly EC_CHOOSESCORE     = 11;	        // 叫分 TReqChooseScore
    static readonly EC_SELLSCORE       = 12;	        // 卖分	TReqSellScore
    static readonly EC_BUYSCORE        = 13;	        // 买分	TReqBuyScore    
    static readonly EC_GETGAMEDATA     = 50;	        // 断线重连取游戏数据
};
