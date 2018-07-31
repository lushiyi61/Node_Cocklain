


// 服务端发出的消息
export class CM_SERVERMSG {
    static readonly ES_GAME_CONFIG 	                = 10;   // 游戏配置广播	 	 				TNotifyGameConfig
    static readonly ES_GAME_START	                = 11;   // 游戏开始	发前4张牌 开始抢庄广播 	 TNotifyGameStart
    static readonly ES_GAME_SNATCHBANKER	        = 12;   // 抢庄广播	     		           TNotifySnatchbanker
    static readonly ES_GAME_SNATCHBANKERFINISH	    = 13;   // 抢庄结果			               TNotifySnatchbankerFinish
    static readonly ES_GAME_CHOOSESCOREBEGIN	    = 14;   // 选分开始(单独通知)				TRespChooseScoreBegin
    static readonly ES_GAME_CHOOSESCORE	            = 15;   // 选分广播		    		        TNotifyChooseScore
    static readonly ES_GAME_CHOOSESCOREFINISH	    = 16;   // 选分结果广播					    TNotifyChooseScoreFinish
    static readonly ES_GAME_SELLBUYBEGIN	        = 17;   // 买卖分开始(单独通知)	 			TRespSellBuyBegin
    static readonly ES_GAME_SELLSCORE               = 18;   // 卖分广播							TNotifySellScore
    static readonly ES_GAME_BUYSCORE	            = 19;   // 买分广播							TNotifyBuyScore
    static readonly ES_GAME_FINISH	                = 20;   // 回合结束广播						TNotifyGameFinish
    static readonly ES_GAME_OVER	                = 21;   // 游戏结束广播						TNotifyGameOver

    static readonly ES_GAME_DATA	                = 50;   // 游戏断线重连数据					TRespGameData
    static readonly ES_GAME_ERROR	                = 99;   // 错误消息
} 
