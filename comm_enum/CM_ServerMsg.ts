


// 服务端发出的消息
export const enum E_SERVER_MSG {
    ES_GAME_CONFIG = 10,	        // 游戏配置广播	 	 				TNotifyGameConfig
    ES_GAME_START,	                // 游戏开始	发前4张牌 开始抢庄	 	 TRespGameStart
    ES_GAME_SNATCHBANKER,	        // 抢庄广播	     		           TNotifySnatchbanker
    ES_GAME_SNATCHBANKERFINISH,	    // 抢庄结果			               TNotifySnatchbankerFinish
    ES_GAME_CHOOSESCOREBEGIN,	    // 选分开始(单独通知)				TRespChooseScoreBegin
    ES_GAME_CHOOSESCORE,	        // 选分广播		    		        TNotifyChooseScore
    ES_GAME_CHOOSESCOREFINISH,	    // 选分结果广播					    TNotifyChooseScoreFinish
    ES_GAME_SELLBUYBEGIN,	        // 买卖分开始(单独通知)	 			TRespSellBuyBegin
    ES_GAME_SELLSCORE,	            // 卖分广播							TNotifySellScore
    ES_GAME_BUYSCORE,	            // 买分广播							TNotifyBuyScore
    ES_GAME_FINISH,	                // 回合结束广播						TNotifyGameFinish
    ES_GAME_OVER,	                // 游戏结束广播						TNotifyGameOver


    ES_GAME_DATA = 50,	            // 游戏断线重连数据					TRespGameData
};
