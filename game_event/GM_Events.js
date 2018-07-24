
var tarsLogs = require("@tars/logs");
var logger = new tarsLogs('TarsDate');

var events = require('events');
var TarsStream = require('@tars/stream');
var TarsGame = require("../tars/TarsGame").TarsGame;

var CocklainStruct = require("../tars/CocklainStructTars").CocklainStruct;

var TableMgr = require("../game_logic/TableMgr");

var emitter_room = new events.EventEmitter();

var emitter_client = new events.EventEmitter();

var mapTableMgr = new Map();

var mapClientMsgExpectStatus = new Map([
    [CocklainStruct.E_CLIENT_MSG.CM_Snatchbanker, CocklainStruct.E_GAME_STATUS.GS_Snatchbanker],
    [CocklainStruct.E_CLIENT_MSG.CM_ChooseBaseScore, CocklainStruct.E_GAME_STATUS.GS_ChooseBaseScore],
    [CocklainStruct.E_CLIENT_MSG.CM_SellScore, CocklainStruct.E_GAME_STATUS.GS_ScoreSellBuy],
    [CocklainStruct.E_CLIENT_MSG.CM_BuyScore, CocklainStruct.E_GAME_STATUS.GS_ScoreSellBuy],
]);

// 返回RoomServer数据
class RoomMsg
{
    constructor(current, tReqMessage, tRespMessage)
    {
        this.current = current;

        this.reqMsgStream = null;
        if (null != tReqMessage){
            this.reqMsgStream = new TarsStream.InputStream(tReqMessage.vecData);
        }

        this.tRespMessage = tRespMessage;
    }

    setClientMsg(eMsgType, nMsgID, tarsData=null)
    {
        if (tarsData != null)
        {
            this.tRespMessage.eMsgType = eMsgType;
            this.tRespMessage.stGameData.stNotifyData.nMsgID = nMsgID;
            this.tRespMessage.stGameData.stNotifyData.vecData = tarsData.toBinBuffer();
        }
    }
    
    responseFail(iRet)
    {
        this.current.sendResponse(iRet, this.tRespMessage);
    }

    setCountdown(uTimeout)
    {
        this.tReqMessage.nTimeout = uTimeout;
    }

    response(uTimeout = 0)
    {
        if (uTimeout != 0)
        {
            this.tReqMessage.nTimeout = uTimeout;
        }

        this.current.sendResponse(0, this.tRespMessage);
    }
}

module.exports = {
    handleRoomMessage: function (current, tReqMessage, tRespMessage) {
        let tableMgr = null;
        if (TarsGame.E_GAME_MSGID.GAMECREATE == tReqMessage.nCmd)
        {
            tableMgr = new TableMgr;
            mapTableMgr.set(tReqMessage.sTableNo, tableMgr);
        }
        else{
            tableMgr = mapTableMgr.get(tReqMessage.sTableNo);
        }

        let roomMsg = new RoomMsg(current, tReqMessage, tRespMessage);

        emitter_room.emit(msgIn.nCmd, roomMsg, tableMgr);
    },

    handleClientMessage: function (current, tReqMessage, tRespMessage) {
        let tableMgr = mapTableMgr.get(tReqMessage.sTableNo);

        let expectStatus = mapClientMsgExpectStatus.get(msgIn.nCmd);
        if (expectStatus != undefined)
        {
            if (expectStatus != tableMgr.tableData.gameStatus)
            {
                return;
            }
        }

        let roomMsg = new RoomMsg(current, tReqMessage, tRespMessage);

        emitter_client.emit(msgIn.nCmd, roomMsg, tableMgr, tReqMessage.nChairIdx);
    }
};

////////////////////////////////////////////////////////////////////////////////////////

// 创建桌子
emitter_room.on(TarsGame.E_GAME_MSGID.GAMECREATE, function (roomMsg, tableMgr) {
    logger.info("TarsGame.E_GAME_MSGID.GAMEPREPARE");
    
    // 保存房间规则
    let reqMsg = new TarsGame.TGameCreate.create(roomMsg.reqMsgStream);
    let roomRules = JSON.parse(reqMsg.toObject().rules);
    tableMgr.init(roomRules);

    roomMsg.response();
});

// 开始游戏
emitter_room.on(TarsGame.E_GAME_MSGID.GAMESTART, function (roomMsg, tableMgr) {
    logger.info("TarsGame.E_GAME_MSGID.GAMESTART");
        
    let msgData = new TarsGame.TGamgStart.create(roomMsg.reqMsgStream);
    let arrUserID = msgData.toObject().vecUserID;
    
    let iRet = tableMgr.startGame(arrUserID, roomMsg);
    if (iRet != 0)
    {
        logger.error("tableMgr.startGame fail:", iRet);
        roomMsg.responseFail(iRet);
        return;
    }

    tableMgr.tableData.gameStatus = CocklainStruct.E_GAME_STATUS.GS_SendCard;
    let countdown = this.tableData.gameConf.mapStatusCoundown.get(this.tableData.gameStatus);
    roomMsg.response(countdown);
});

// 超时
emitter_room.on(TarsGame.E_GAME_MSGID.GAMETIMEOUT, function (roomMsg, tableMgr) {
    logger.info("TarsGame.E_GAME_MSGID.GAMETIMEOUT");
    
    let iRet = tableMgr.goFoword(roomMsg);
    if (iRet != 0)
    {
        logger.error("tableMgr.goFoword fail:", iRet);
        roomMsg.responseFail(iRet);
        return;
    }

    roomMsg.response();
});

// 玩家抢庄
emitter_client.on(CocklainStruct.E_CLIENT_MSG.CM_Snatchbanker, function (roomMsg, tableMgr, nChairIdx) {
    logger.info("CocklainStruct.E_CLIENT_MSG.CM_Snatchbanker");

    let msgData = new CocklainStruct.TUserSnatchbankerMultiple.create(roomMsg.reqMsgStream);
    msgData = msgData.toObject();
    
    let iRet = tableMgr.handleUserSnatchbanker(nChairIdx, msgData.uiMultiple, roomMsg);
    if (iRet != 0)
    {
        logger.error("tableMgr.handleUserSnatchbanker fail:", iRet);
        roomMsg.responseFail(iRet);
        return;
    }
    
    roomMsg.response();
});

// 玩家选底分
emitter_client.on(CocklainStruct.E_CLIENT_MSG.CM_ChooseBaseScore, function (roomMsg, tableMgr, nChairIdx) {
    logger.info("CocklainStruct.E_CLIENT_MSG.CM_ChooseBaseScore");

    let msgData = new CocklainStruct.TUserChooseBaseScore.create(roomMsg.reqMsgStream);
    msgData = msgData.toObject();
    
    let iRet = tableMgr.handleUserChooseBaseScore(nChairIdx, msgData.uiBaseScore, roomMsg);
    if (iRet != 0)
    {
        logger.error("tableMgr.handleUserChooseBaseScore fail:", iRet);
        roomMsg.responseFail(iRet);
        return;
    }
    
    roomMsg.response();
});

// 玩家卖分
emitter_client.on(CocklainStruct.E_CLIENT_MSG.CM_SellScore, function (roomMsg, tableMgr, nChairIdx) {
    logger.info("CocklainStruct.E_CLIENT_MSG.CM_SellScore");
    
    let msgData = new CocklainStruct.TIntMsg.create(roomMsg.reqMsgStream);
    let nScore = msgData.toObject().iValue;

    let iRet = tableMgr.handleUserSellScore(nChairIdx, nScore, roomMsg);
    if (iRet != 0)
    {
        logger.error("tableMgr.handleUserSellScore fail:", iRet);
        roomMsg.responseFail(iRet);
        return;
    }
    
    roomMsg.response();
});

// 玩家买分
emitter_client.on(CocklainStruct.E_CLIENT_MSG.CM_BuyScore, function (roomMsg, tableMgr, nChairIdx) {
    logger.info("CocklainStruct.E_CLIENT_MSG.CM_BuyScore");
    
    let msgData = new CocklainStruct.TIntMsg.create(roomMsg.reqMsgStream);
    let nSrcChairIdx = msgData.toObject().iValue;
    
    let iRet = tableMgr.handleUserBuyScore(nChairIdx, nSrcChairIdx, roomMsg);
    if (iRet != 0)
    {
        logger.error("tableMgr.handleUserBuyScore fail:", iRet);
        roomMsg.responseFail(iRet);
        return;
    }
    
    roomMsg.response();
});

// 记录玩家昵称头像
emitter_client.on(CocklainStruct.E_CLIENT_MSG.CM_UserHead, function (roomMsg, tableMgr, nChairIdx) {
    logger.info("CocklainStruct.E_CLIENT_MSG.CM_UserHead");
    
    let msgData = new CocklainStruct.TUserHead.create(roomMsg.reqMsgStream);
    msgData = msgData.toObject();
    
    tableMgr.setUserHead(nChairIdx, msgData.strNickname, msgData.strHeadImgURL);

    roomMsg.response();
});

// 玩家断线重连获取游戏数据
emitter_client.on(CocklainStruct.E_CLIENT_MSG.CM_GetGameData, function (roomMsg, tableMgr, nChairIdx) {
    logger.info("CocklainStruct.E_CLIENT_MSG.CM_GetGameData");

    let tarsData = tableMgr.tableData.genGameData();
    roomMsg.setClientMsg(TarsGame.EGameMsgType.ERESPONEDATA, CocklainStruct.E_SERVER_MSG.SM_GameData, tarsData);
    
    roomMsg.response();
});
