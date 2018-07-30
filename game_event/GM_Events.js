
var tarsLogs = require("@tars/logs");
var logger = new tarsLogs('TarsDate');
var events = require('events');
var TarsStream = require('@tars/stream');

var TarsGame = require("../tars/TarsGame").TarsGame;
var CocklainStruct = require("../tars/CocklainStructTars").CocklainStruct;
var GM_GameData = require("../game_data/GM_GameData").GM_GameData;
var {
    handleGameStart,
    handleSnatchbanker,
    handleChooseScore,
    handleSellSocre,
    handleBuySocre
} = require("../game_logic/GM_GameLogic");

// 信号管理
var emitter_room = new events.EventEmitter();
var emitter_client = new events.EventEmitter();
var mapTableMng = new Map();// 游戏桌管理

var mapClientMsgExpectStatus = new Map([
    [CocklainStruct.E_CLIENT_MSG.CM_Snatchbanker, CocklainStruct.E_GAME_STATUS.GS_Snatchbanker],
    [CocklainStruct.E_CLIENT_MSG.CM_ChooseBaseScore, CocklainStruct.E_GAME_STATUS.GS_ChooseBaseScore],
    [CocklainStruct.E_CLIENT_MSG.CM_SellScore, CocklainStruct.E_GAME_STATUS.GS_ScoreSellBuy],
    [CocklainStruct.E_CLIENT_MSG.CM_BuyScore, CocklainStruct.E_GAME_STATUS.GS_ScoreSellBuy],
]);

{
    // 返回RoomServer数据

    // module.exports = {
    //     handleRoomMessage: function (current, tReqMessage, tRespMessage) {
    //         let tableMgr = null;
    //         if (TarsGame.E_GAME_MSGID.GAMECREATE == tReqMessage.nCmd) {
    //             tableMgr = new TableMgr;
    //             mapTableMgr.set(tReqMessage.sTableNo, tableMgr);
    //         }
    //         else {
    //             tableMgr = mapTableMgr.get(tReqMessage.sTableNo);
    //         }

    //         let roomMsg = new RoomMsg(current, tReqMessage, tRespMessage);

    //         emitter_room.emit(msgIn.nCmd, roomMsg, tableMgr);
    //     },

    //     handleClientMessage: function (current, tReqMessage, tRespMessage) {
    //         let tableMgr = mapTableMgr.get(tReqMessage.sTableNo);

    //         let expectStatus = mapClientMsgExpectStatus.get(msgIn.nCmd);
    //         if (expectStatus != undefined) {
    //             if (expectStatus != tableMgr.tableData.gameStatus) {
    //                 return;
    //             }
    //         }

    //         let roomMsg = new RoomMsg(current, tReqMessage, tRespMessage);

    //         emitter_client.emit(msgIn.nCmd, roomMsg, tableMgr, tReqMessage.nChairIdx);
    //     }
    // };
}

module.exports = {
    handleRoomMessage: function (current, tReqRoomMsg, tRespMessage) {
        emitter_room.emit(tReqRoomMsg.nCmd, current, tReqRoomMsg, tRespMessage);
    },

    handleClientMessage: function (current, tReqRTMsg, tRespMessage) {
        if (!mapTableMng.has(tReqRTMsg.sTableNo)) {
            logger.error("to Client:the table don't exist,tableNo is ", tReqRTMsg.sTableNo);
            logger.error("=====================================");
            current.sendResponse(-999, tRespMessage);
            return;
        }

        emitter_client.emit(tReqRTMsg.nCmd, current, tReqRTMsg, tRespMessage);
    }
};

/////////////////////////////////////////RoomServer///////////////////////////////////////////////
// 创建桌子
emitter_room.on(TarsGame.E_GAME_MSGID.GAMECREATE, function (current, tReqRoomMsg, tRespMessage) {
    logger.info("TarsGame.E_GAME_MSGID.GAMECREATE");
    const tGameCreate_t = new TarsGame.TGameCreate.create(new TarsStream.InputStream(tReqRoomMsg.vecData));
    const tGameCreate = tGameCreate_t.toObject();

    if (mapTableMng.has(tReqRoomMsg.sTableNo)) {
        logger.error("mapTableMng.has(tReqRoomMsg.sTableNo)");
        logger.error(mapTableMng.get(tReqRoomMsg.sTableNo));
        logger.error("=====================================");
        current.sendResponse(-999, tRespMessage);
        return;
    }
    const gameData = new GM_GameData(tGameCreate.roomType, tGameCreate.rules);
    mapTableMng.set(tReqRoomMsg.sTableNo, gameData);

    current.sendResponse(TarsGame.E_GAME_MSGID.GAMESTART, tRespMessage);
});

// 开始游戏
emitter_room.on(TarsGame.E_GAME_MSGID.GAMESTART, function (current, tReqRoomMsg, tRespMessage) {
    logger.info("TarsGame.E_GAME_MSGID.GAMESTART");

    if (!mapTableMng.has(tReqRoomMsg.sTableNo)) {
        logger.error("to RoomServer:the table don't exist,tableNo is ", tReqRoomMsg.sTableNo);
        logger.error("=====================================");
        current.sendResponse(-999, tRespMessage);
        return;
    }

    const gameData = mapTableMng.get(tReqRoomMsg.sTableNo);
    const tGameStart_t = new TarsGame.TGamgStart.create(new TarsStream.InputStream(tReqRoomMsg.vecData));
    const tGameStart = tGameStart_t.toObject();
    handleGameStart(gameData, tGameStart.vecUserID);

    // 游戏数据
    const tRespGameStart_t = new CocklainStruct.TRespGameStart();
    tRespGameStart_t.currRound = gameData.tableInfo.currRound;
    tRespGameStart_t.listCardInfo.readFromObject(gameData.userMng.listUserInfo);

    const tData_t = new TarsGame.TData();
    tData_t.nMsgID = CocklainStruct.E_SERVER_MSG.E_GAME_START;
    tData_t.vecData = tRespGameStart_t.toBinBuffer();
    tRespMessage.eMsgType = TarsGame.EGameMsgType.E_NOTIFY_DATA;
    tRespMessage.tGameData.tNotifyData = tData_t;

    current.sendResponse(0, tRespMessage);
});

// 超时
emitter_room.on(TarsGame.E_GAME_MSGID.GAMETIMEOUT, function (current, tReqRoomMsg, tRespMessage) {
    logger.info("TarsGame.E_GAME_MSGID.GAMETIMEOUT");
});

// 结束游戏
emitter_room.on(TarsGame.E_GAME_MSGID.GAMEFINISH, function (current, tReqRoomMsg, tRespMessage) {
    logger.info("TarsGame.E_GAME_MSGID.GAMEFINISH");
});

// 解散游戏
emitter_room.on(TarsGame.E_GAME_MSGID.GAMEDISMISS, function (current, tReqRoomMsg, tRespMessage) {
    logger.info("TarsGame.E_GAME_MSGID.GAMEDISMISS");
});

// 游戏动作
emitter_room.on(TarsGame.E_GAME_MSGID.GAMEACTION, function (current, tReqRoomMsg, tRespMessage) {
    logger.info("TarsGame.E_GAME_MSGID.GAMEACTION");
});


///////////////////////////////////////ClientMessage//////////////////////////////////////////////
// 玩家抢庄
emitter_client.on(CocklainStruct.E_CLIENT_MSG.EC_SNATCHBANKER, function (current, tReqRTMsg, tRespMessage) {
    logger.info("CocklainStruct.E_CLIENT_MSG.E_SNATCHBANKER");
    const gameData = mapTableMng.get(tReqRTMsg.sTableNo);

    const tReqSnatchbanker_t = new CocklainStruct.TReqSnatchbanker.create(new TarsStream.InputStream(tReqRoomMsg.vecData));
    const tReqSnatchbanker = tReqSnatchbanker_t.toObject();

    // 处理玩家动作
    handleSnatchbanker(gameData, tReqRTMsg.nChairIdx, tReqSnatchbanker.multiple);

    // 返回游戏数据
    const tRespSnatchbanker_t = new CocklainStruct.TRespSnatchbanker();
    tRespSnatchbanker_t.chairIdx = tReqRTMsg.nChairIdx;
    tRespSnatchbanker_t.multiple = tReqSnatchbanker.multiple;


    const tData_t = new TarsGame.TData();
    tData_t.nMsgID = CocklainStruct.E_SERVER_MSG.ES_GAME_SNATCHBANKER;
    tData_t.vecData = tRespSnatchbanker_t.toBinBuffer();
    tRespMessage.eMsgType = TarsGame.EGameMsgType.E_NOTIFY_DATA;
    tRespMessage.tGameData.tNotifyData = tData_t;

    // 检查是否抢庄完毕，是则通知RoomServer请求GAMEACTION
    let res = 0;
    if (gameData.userMng.CheckSnatchbanker()) {
        res = TarsGame.E_GAME_MSGID.GAMEACTION;
    }
    current.sendResponse(res, tRespMessage);
});

// 玩家选底分
emitter_client.on(CocklainStruct.E_CLIENT_MSG.EC_CHOOSESCORE, function (current, tReqRTMsg, tRespMessage) {
    logger.info("CocklainStruct.E_CLIENT_MSG.E_GAME_CHOOSESCORE");
    const gameData = mapTableMng.get(tReqRTMsg.sTableNo);

    const tReqChooseScore_t = new CocklainStruct.TReqChooseScore.create(new TarsStream.InputStream(tReqRoomMsg.vecData));
    const tReqChooseScore = tReqChooseScore_t.toObject();

    // 处理玩家动作
    handleChooseScore(gameData, tReqRTMsg.nChairIdx, tReqChooseScore.chooseScore);

    // 返回游戏数据
    const tRespChooseScore_t = new CocklainStruct.TRespChooseScore();
    tRespChooseScore_t.chairIdx = tReqRTMsg.nChairIdx;
    tRespChooseScore_t.chooseScore = tReqSnatchbanker.chooseScore;


    const tData_t = new TarsGame.TData();
    tData_t.nMsgID = CocklainStruct.E_SERVER_MSG.ES_GAME_CHOOSESCORE;
    tData_t.vecData = tRespSnatchbanker_t.toBinBuffer();
    tRespMessage.eMsgType = TarsGame.EGameMsgType.E_NOTIFY_DATA;
    tRespMessage.tGameData.tNotifyData = tData_t;

    let res = 0;
    if (gameData.userMng.CheckChooseScore()) {
        res = TarsGame.E_GAME_MSGID.GAMEACTION;
    }
    current.sendResponse(res, tRespMessage);

});

// 玩家卖分
emitter_client.on(CocklainStruct.E_CLIENT_MSG.EC_SELLSCORE, function (current, tReqRTMsg, tRespMessage) {
    logger.info("CocklainStruct.E_CLIENT_MSG.EC_SELLSCORE");
    const gameData = mapTableMng.get(tReqRTMsg.sTableNo);

    const tReqSellScore_t = new CocklainStruct.TReqSellScore.create(new TarsStream.InputStream(tReqRoomMsg.vecData));
    const tReqSellScore = tReqSellScore_t.toObject();

    // 处理玩家动作
    handleSellSocre(gameData, tReqRTMsg.nChairIdx, tReqSellScore.score);

    // 返回游戏数据
    const tRespChooseScore_t = new CocklainStruct.TRespChooseScore();
    tRespChooseScore_t.chairIdx = tReqRTMsg.nChairIdx;
    tRespChooseScore_t.chooseScore = tReqSnatchbanker.chooseScore;


    const tData_t = new TarsGame.TData();
    tData_t.nMsgID = CocklainStruct.E_SERVER_MSG.ES_GAME_CHOOSESCORE;
    tData_t.vecData = tRespSnatchbanker_t.toBinBuffer();
    tRespMessage.eMsgType = TarsGame.EGameMsgType.E_NOTIFY_DATA;
    tRespMessage.tGameData.tNotifyData = tData_t;

    current.sendResponse(0, tRespMessage);
});

// 玩家买分
emitter_client.on(CocklainStruct.E_CLIENT_MSG.EC_BUYSCORE, function (current, tReqRTMsg, tRespMessage) {
    logger.info("CocklainStruct.E_CLIENT_MSG.EC_BUYSCORE");
    const gameData = mapTableMng.get(tReqRTMsg.sTableNo);

    const tReqBuyScore_t = new CocklainStruct.TReqBuyScore.create(new TarsStream.InputStream(tReqRoomMsg.vecData));
    const tReqBuyScore = tReqBuyScore_t.toObject();

    // 处理玩家动作
    handleBuySocre(gameData, tReqRTMsg.nChairIdx, tReqBuyScore.chairIdx);

    // 返回游戏数据
    const tRespChooseScore_t = new CocklainStruct.TRespChooseScore();
    tRespChooseScore_t.chairIdx = tReqRTMsg.nChairIdx;
    tRespChooseScore_t.chooseScore = tReqSnatchbanker.chooseScore;


    const tData_t = new TarsGame.TData();
    tData_t.nMsgID = CocklainStruct.E_SERVER_MSG.ES_GAME_CHOOSESCORE;
    tData_t.vecData = tRespSnatchbanker_t.toBinBuffer();
    tRespMessage.eMsgType = TarsGame.EGameMsgType.E_NOTIFY_DATA;
    tRespMessage.tGameData.tNotifyData = tData_t;

    current.sendResponse(0, tRespMessage);
});

// 记录玩家昵称头像
{
    // emitter_client.on(CocklainStruct.E_CLIENT_MSG.CM_UserHead, function (roomMsg, tableMgr, nChairIdx) {
    //     logger.info("CocklainStruct.E_CLIENT_MSG.CM_UserHead");

    //     let msgData = new CocklainStruct.TUserHead.create(roomMsg.reqMsgStream);
    //     msgData = msgData.toObject();

    //     tableMgr.setUserHead(nChairIdx, msgData.strNickname, msgData.strHeadImgURL);

    //     roomMsg.response();
    // });
}

// 玩家断线重连获取游戏数据
emitter_client.on(CocklainStruct.E_CLIENT_MSG.EC_GETGAMEDATA, function (current, tReqRTMsg, tRespMessage) {
    logger.info("CocklainStruct.E_CLIENT_MSG.EC_GETGAMEDATA");


});
