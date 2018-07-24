

var tarsLogs = require("@tars/logs");
var logger = new tarsLogs('TarsDate');

var TableData = require("../game_data/TableData");

var caleResult = require("./CaleResult.js").caleResult;

class TableMgr
{
    constructor()
    {
        this.tableData = new TableData;
        
        this.cardMgr = new CardMgr; // 牌类
    }

    init(roomRules)
    {
        //this.tableData.roomRules;
    }

    // 游戏开始
    startGame(arrUserID, roomMsg)
    {
        this.tableData.arrUserRoundData = arrUserID.map(function(userID){
            if (!this.tableData.mapUserInfo.has(userID))
            {
                this.tableData.mapUserInfo.set(userID, new UserInfo(userID));
            }

            return new UserRoundData(this.tableData.mapUserInfo.get(userID))
        });

        this.tableData.currRound++;
    
        this.cardMgr.washCard(); // 洗牌
    
        // 发前4张牌
        for (let userRoundData of this.tableData.arrUserRoundData) {
            userRoundData.arrCards = this.cardMgr.fetchCard(4);
        }
        
        // 广播发牌数据
        let tarsData = new CocklainStruct.TSendCardData();
        tarsData.readFromObject(this.tableData.genSendCardData());
        roomMsg.setClientMsg(TarsGame.EGameMsgType.ERESPALLDATA, CocklainStruct.E_SERVER_MSG.SM_SendCard, tarsData);
    }

    setUserHead(nChairIdx, strNickname, strHeadImgURL)
    {
        let userRoundData = this.tableData.arrUserRoundData[nChairIdx];
        if (userRoundData == undefined)
        {
            return;
        }

        userRoundData.userInfo.strNickname = strNickname;
        userRoundData.userInfo.strHeadImgURL = strHeadImgURL;
    }
    
    // 游戏状态迁移
    goFoword(roomMsg)
    {
        this.tableData.gameStatus++;
        if (this.tableData.gameStatus == CocklainStruct.E_GAME_STATUS.GS_ScoreSellBuy)
        {
            if (!this.tableData.roomRules.bEnableWaiWei)
            {
                this.tableData.gameStatus++;
            }
        }
        
        logger.info("goFoword gameStatus:", this.tableData.gameStatus);

        let countdown = 0;
        let statusCountdown = this.tableData.gameConf.mapStatusCoundown.get(this.tableData.gameStatus);
        if (statusCountdown != undefined)
        {
            countdown = statusCountdown;
        }
        
        let iRet = 0;
        switch(this.tableData.gameStatus)
        {
        case CocklainStruct.E_GAME_STATUS.GS_Snatchbanker: // 开始抢庄
            roomMsg.setClientMsg(TarsGame.EGameMsgType.ERESPALLDATA, CocklainStruct.E_SERVER_MSG.SM_Snatchbanker);
        
            break;
        case CocklainStruct.E_CLIENT_MSG.GS_ChooseBaseScore: // 开始选底分
            let tarsData = new CocklainStruct.TBaseScoreConf;    
            tarsData.readFromObject(tableMgr.tableData.genBaseScoreConf());
            roomMsg.setClientMsg(TarsGame.EGameMsgType.ERESPALLDATA, CocklainStruct.E_SERVER_MSG.SM_ChooseBaseScore, tarsData);

            break;
        case CocklainStruct.E_CLIENT_MSG.GS_ScoreSellBuy: // 开始买卖分
            let tarsData = this.tableData.genSellBuyScoreConf();
            roomMsg.setClientMsg(TarsGame.EGameMsgType.ERESPALLDATA, CocklainStruct.E_SERVER_MSG.SM_ScoreSellBuy, tarsData);
            
            break;
        case CocklainStruct.E_CLIENT_MSG.GS_SendLastCard: // 发最后一张牌、结算
            iRet = this.sendLastCard(roomMsg);
            if (iRet != 0)
            {
                roomMsg.responseFail(iRet);
                return;
            }

            break;
        case CocklainStruct.E_CLIENT_MSG.GS_RoundEnd: // 进入局间等待
            if (this.tableData.currRound < this.tableData.roomRules.uiMaxRound)
            {
                roomMsg.setClientMsg(TarsGame.EGameMsgType.ERESPALLDATA, CocklainStruct.E_SERVER_MSG.SM_RoundEnd);
            }
            else
            {
                // 结束游戏
                let tarsData = this.tableData.genGameResult();
                roomMsg.setClientMsg(TarsGame.EGameMsgType.ERESPALLDATA, CocklainStruct.E_SERVER_MSG.SM_GameEnd, tarsData);
                iRet = E_GAME_MSGID.GAMERESULT; // 结束游戏
            }

            break;
        default:
            return;
        }

        if (iRet != 0)
        {
            logger.error("goFoword fail:", iRet, " gameStatus:", this.tableData.gameStatus);
            roomMsg.responseFail(iRet);
            return;
        }

        roomMsg.response(countdown);
    }

    // 发最后一张牌、结算
    sendLastCard(roomMsg)
    {
        for (let userRoundData of this.tableData.arrUserRoundData) {
            userRoundData.arrCards.push(...this.cardMgr.fetchCard(1));

	        // 算牌型
            userRoundData.eCardPattern = this.cardMgr.caleCardPattern(userRoundData.arrCards, userRoundData.arrNiuCards);
        }
     
        // 结算
        if (!caleResult(this.tableData.arrUserRoundData, this.tableData.roomRules))
        {
            logger.error("结算失败");
            return -1;
        }

        // 广播结算数据
        let tarsData = new CocklainStruct.TRoundResult();
        tarsData.readFromObject(this.tableData.genRoundResult());
        roomMsg.setClientMsg(TarsGame.EGameMsgType.ERESPALLDATA, CocklainStruct.E_SERVER_MSG.SM_SendLastCard, tarsData);

        return 0;
    }

    // 处理玩家抢庄
    handleUserSnatchbanker(uiChairIndex, uiMultiple, roomMsg)
    {
        let userRoundData = this.tableData.arrUserRoundData[uiChairIndex];
        if (userRoundData == undefined)
        {
            return -1;
        }

        userRoundData.uiSnatchbankerMutiple = uiMultiple;
        userRoundData.bHasSnatchbanker = true;
    
        if (this.tableData.arrUserRoundData.every(userRoundData=>userRoundData.bHasSnatchbanker)) // 所有人都执行过操作
        {
            roomMsg.setCountdown(1); // 1秒后进入下一状态
        }
        
        return 0;
    }

    // 处理玩家选底分
    handleUserChooseBaseScore(uiChairIndex, uiBaseScore, roomMsg)
    {
        let userRoundData = this.tableData.arrUserRoundData[uiChairIndex];
        if (userRoundData == undefined)
        {
            return -1;
        }

        if (userRoundData.bBanker)
        {
            return -1;
        }

        userRoundData.uiBaseScore = uiBaseScore;
        userRoundData.bHasChooseBaseScore = true;
        
        // 广播玩家叫分消息
        let data = {uiChairIndex : uiChairIndex, uiBaseScore : uiBaseScore};
        let tarsData = new CocklainStruct.TUserChooseBaseScore;    
        tarsData.readFromObject(data);
        roomMsg.setClientMsg(TarsGame.EGameMsgType.ERESPALLDATA, CocklainStruct.E_SERVER_MSG.SM_CM_ChooseBaseScore, tarsData);
        
        if (this.tableData.arrUserRoundData.every(userRoundData=>userRoundData.bHasChooseBaseScore)) // 所有人都执行过操作
        {
            roomMsg.setCountdown(1); // 1秒后进入下一状态
        }
        
        return 0;
    }

    // 处理玩家卖分
    handleUserSellScore(nChairIdx, nScore, roomMsg)
    {
        let userRoundData = this.tableData.arrUserRoundData[nChairIdx];
        if (userRoundData == undefined)
        {
            return -1;
        }

        if (userRoundData.bBanker)
        {
            return -1;
        }

        if (0 < userRoundData.uiSellScore)
        {
            return -1;
        }

        userRoundData.uiSellScore = nScore;

        // 广播买卖分记录
        let tarsData = new CocklainStruct.TScoreSellBuyRecord;    
        tarsData.readFromObject(this.tableData.genSellBuyRecord());
        roomMsg.setClientMsg(TarsGame.EGameMsgType.ERESPALLDATA, CocklainStruct.E_SERVER_MSG.SM_ScoreSellBuyRecord, tarsData);

        return 0;
    }

    // 处理玩家买分
    handleUserBuyScore(nChairIdx, nSrcChairIdx, roomMsg)
    {
        if (nSrcChairIdx == nChairIdx)
        {
            return -1;
        }

        let userRoundData = this.tableData.arrUserRoundData[nChairIdx];
        if (userRoundData == undefined)
        {
            return -1;
        }
        if (userRoundData.bBanker)
        {
            return -1;
        }

        let srcUserRoundData = this.tableData.arrUserRoundData[nSrcChairIdx];
        if (srcUserRoundData == undefined)
        {
            return -1;
        }        
        if (0 == srcUserRoundData.uiSellScore)
        {
            return -1;
        }
        if (0 != srcUserRoundData.uiSellToUserID)
        {
            return -1;
        }
        
        userRoundData.mapBuyScore.set(nSrcChairIdx, srcUserRoundData.uiSellScore);
        srcUserRoundData.uiSellToChairIdx = nChairIdx;

        // 广播买卖分记录
        let tarsData = new CocklainStruct.TScoreSellBuyRecord;    
        tarsData.readFromObject(this.tableData.genSellBuyRecord());
        roomMsg.setClientMsg(TarsGame.EGameMsgType.ERESPALLDATA, CocklainStruct.E_SERVER_MSG.SM_ScoreSellBuyRecord, tarsData);

        return 0;
    }
}
