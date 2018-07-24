
var {UserInfo, UserRoundData} = require("./UserInfo.js");

var CocklainStruct = require("../tars/CocklainStructTars").CocklainStruct;

var gameConf = require("./gameConf.js");

const MaxUserCount = 6

class RoomRules
{
    constructor()
    {
        this.uiBaseScore1 = 0;
        this.uiBaseScore2 = 0;

        this.bEnableWaiWei = false;

        this.uiMaxBolusMultiple = 0;

        this.uiMaxRound = 0;
    }
}

class TableData
{
    constructor()
    {
        this.gameConf = gameConf; // 游戏配置

        this.roomRules = new RoomRules; // 房间配置

        this.currRound = 0; // 当前局数

        this.mapUserInfo = new Map; // 玩家信息
        this.arrUserRoundData = null; // 回合数据
        
        this.gameStatus = CocklainStruct.E_GAME_STATUS.GS_SendCard;	// 游戏状态
    }

    // 生成发牌数据
    genSendCardData()
    {
        return {
            uiCurrRound : tableData.currRound,
            vecUserCards : this.arrUserRoundData.map(userRoundData=>({vecCards : userRoundData.arrCards}))
        };
    }

    // 生成叫分设置
    genBaseScoreConf()
    {
        return {
            uiBaseScore1 : this.roomRules.uiBaseScore1,

            uiBaseScore2 : this.roomRules.uiBaseScore2,
        
            // 玩家推注设置
            arrUserBolusConf : this.arrUserRoundData.map(function(userRoundData, uIndex) {
                if (userRoundData.bBanker)
                {
                    continue;
                }
                
                if (0 == userRoundData.userInfo.uiBolusMutiple)
                {
                    continue;
                }

                return {uiChairIndex : uIndex, uiBolusMutiple : userRoundData.userInfo.uiBolusMutiple};
            })
        };
    }

    // 生成买卖分设置
    genSellBuyScoreConf()
    {
        let tarsData = new CocklainStruct.TScoreSellBuyConf;
        tarsData.readFromObject({vecSellBuyScores : this.gameConf.arrSellBuyScore});
        return tarsData;
    }

    // 生成买卖分记录
    genSellBuyRecord()
    {
        return {
            vecUserScoreSellBuy : this.arrUserRoundData.filter(userRoundData=>!userRoundData.bBanker).map(function(userRoundData){
                return {
                    uiSellScore : userRoundData.uiSellScore,
                    bSelled : (0 != userRoundData.uiSellToUserID),
                    uiBuyedScore : [...userRoundData.mapBuyScore.values()].reduce((prev,cur)=>prev+cur)
                }
            })
        };
    }

    // 生成回合结算数据
    genRoundResult()
    {
        return {
            userCard : genSendCardData(),

            vecUserResult : this.arrUserRoundData.map(function(userRoundData) {
                return {eCardPattern : userRoundData.eCardPattern,
                        vecNiuCards: userRoundData.arrNiuCards,
                        iGainScore : userRoundData.iGainScore,
                        iRemainScore : userRoundData.userInfo.iRemainScore,
                        bBanker : userRoundData.bBanker
                };
            })
        };
    }
    
    // 生成总结算消息
    genGameResult(bByDismiss)
    {
        let data = {
            bByDismiss : bByDismiss,
    
            vecUserGameResult : [...this.tableData.mapUserInfo.values()].map(function(userInfo){
                return {
                    uiUserID : userInfo.uiUserID,
                    iRemainScore : userInfo.iRemainScore,
                    strNickname : userInfo.strNickname,
                    strHeadImgURL : userInfo.strHeadImgURL,
                };
            })
        };

        let tarsData = new CocklainStruct.TScoreSellBuyConf;
        tarsData.readFromObject(data);

        return tarsData;
    }

    genGameData(nChairIdx)
    {
        let data = {};
        data.uiChairIndex = nChairIdx;

    	// 倒计时配置
        data.vecMsgCountdownTime = [
            {msg: CocklainStruct.E_SERVER_MSG.SM_Snatchbanker, uiTime: 8-2},
            {msg: CocklainStruct.E_SERVER_MSG.SM_ChooseBaseScore, uiTime: 8-2},
            {msg: CocklainStruct.E_SERVER_MSG.SM_ScoreSellBuy, uiTime: 8-2},
        ];

	    data.vecOdds = [...mapOdds.values()]; // 赔率数据

        data.uiCurrRound = this.currRound;
        data.eGameStatus = this.gameStatus;
        
        // 玩家数据
        data.vecUserDetail = this.arrUserRoundData.map(function(userRoundData){
            return {
                bBanker : userRoundData.bBanker,
                uiSnatchbankerMutiple : userRoundData.uiSnatchbankerMutiple,
                uiBaseScore : userRoundData.uiBaseScore,
                iRemainScore : userRoundData.iRemainScore,
            };
        });
        
        data.sendCardData = genSendCardData();
        
        // 叫分数据
        if (GS_ChooseBaseScore == this.gameStatus)
        {
            data.baseScoreConf = genBaseScoreConf();
        }

        // 买卖分数据
        if (GS_ScoreSellBuy <= this.gameStatus)
        {
            if (this.roomRules.bEnableWaiWei)
            {
                data.scoreSellBuyConf = {vecSellBuyScores : gameConf.arrSellBuyScore};
                data.scoreSellBuyRecord = genSellBuyRecord();
            }
        }

        // 回合结算数据
        data.roundResult = genRoundResult();

        let tarsData = new CocklainStruct.TGameData();
        tarsData.readFromObject(data);
        return tarsData;
    }
}

module.exports = TableData;
