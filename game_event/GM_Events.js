
var tarsLogs = require("@tars/logs");
var logger = new tarsLogs('TarsDate');
var events = require('events');
var TarsStream = require('@tars/stream');

var TarsGame = require("../tars/TarsGame").TarsGame;
var CocklainStruct = require("../tars/CocklainStructTars").CocklainStruct;
var GM_GameData = require("../game_data/GM_GameData").GM_GameData;
var CM_ROUNDFLAG = require("../comm_enum/CM_RoundFlag").CM_ROUNDFLAG;
var CM_CLIENTMSG = require("../comm_enum/CM_ClientMsg").CM_CLIENTMSG;
var CM_SERVERMSG = require("../comm_enum/CM_ServerMsg").CM_SERVERMSG;
var CM_RETCODE = require("../comm_enum/CM_RETCODE").CM_RETCODE;
var _ = require("lodash");

var {
    handleGameStart,
    handleSnatchbanker,
    handleChooseScore,
    handleSellSocre,
    handleBuySocre,
    handleGameFinish,
    handleGameAction
} = require("../game_logic/GM_GameLogic");

// 信号管理
var emitter_room = new events.EventEmitter();
var emitter_client = new events.EventEmitter();
var mapTableMng = new Map();// 游戏桌管理

module.exports = {
    handleRoomMessage: function (current, tReqRoomMsg, tRespMessage) {
        if (!mapTableMng.has(tReqRoomMsg.sTableNo) && tReqRoomMsg.nMsgID != TarsGame.E_GAME_MSGID.GAMECREATE) {
            logger.error("to RoomServer:the table don't exist,tableNo is", tReqRoomMsg.sTableNo);
            logger.error("=====================================");
            current.sendResponse(-999, tRespMessage);
            return;
        }

        emitter_room.emit(tReqRoomMsg.nMsgID, current, tReqRoomMsg, tRespMessage);
    },

    handleClientMessage: function (current, tReqRTMsg, tRespMessage) {
        if (!mapTableMng.has(tReqRTMsg.sTableNo)) {
            logger.error("to Client:the table don't exist,tableNo is ", tReqRTMsg.sTableNo);
            logger.error("=====================================");
            current.sendResponse(-999, tRespMessage);
            return;
        }

        emitter_client.emit(tReqRTMsg.nMsgID, current, tReqRTMsg, tRespMessage);
    }
};

/////////////////////////////////////////RoomServer///////////////////////////////////////////////
// 创建桌子
emitter_room.on(TarsGame.E_GAME_MSGID.GAMECREATE, function (current, tReqRoomMsg, tRespMessage) {
    logger.info("TarsGame.E_GAME_MSGID.GAMECREATE");
    const tGameCreate_t = new TarsGame.TGameCreate.create(new TarsStream.TarsInputStream(tReqRoomMsg.vecData));
    const tGameCreate = tGameCreate_t.toObject();

    // if (mapTableMng.has(tReqRoomMsg.sTableNo)) {
    //     logger.error("mapTableMng.has(tReqRoomMsg.sTableNo)");
    //     logger.error(mapTableMng.get(tReqRoomMsg.sTableNo));
    //     logger.error("=====================================");
    //     current.sendResponse(-999, tRespMessage);
    //     return;
    // }
    const gameData = new GM_GameData(tGameCreate.roomType, tGameCreate.rules);
    mapTableMng.set(tReqRoomMsg.sTableNo, gameData);

    // 广播游戏配置ES_GAME_CONFIG
    tRespMessage.eMsgType = TarsGame.EGameMsgType.E_NONE_DATA;
    current.sendResponse(TarsGame.E_GAME_MSGID.GAMESTART, tRespMessage);
});

// 开始游戏
emitter_room.on(TarsGame.E_GAME_MSGID.GAMESTART, function (current, tReqRoomMsg, tRespMessage) {
    logger.info("TarsGame.E_GAME_MSGID.GAMESTART");

    const gameData = mapTableMng.get(tReqRoomMsg.sTableNo);
    const tGameStart_t = new TarsGame.TGamgStart.create(new TarsStream.TarsInputStream(tReqRoomMsg.vecData));
    const tGameStart = tGameStart_t.toObject();
    console.log(tGameStart);
    handleGameStart(gameData, tGameStart.playerInfo);

    const roundCurr = gameData.tableInfo.roundCurr;
    const listChairNo = tGameStart.playerInfo.map(userInfo => {
        return userInfo.nChairNo
    });
    // 游戏数据
    gameData.userMng.listUserInfo.map(userInfo => {
        const tNotifyGameStart_t = new CocklainStruct.TNotifyGameStart();
        tNotifyGameStart_t.roundCurr = roundCurr;
        tNotifyGameStart_t.cards.readFromObject(userInfo.arrCards);
        tNotifyGameStart_t.listChairNo.readFromObject(listChairNo);

        const tData_t = new TarsGame.TData();
        tData_t.nMsgID = CM_SERVERMSG.ES_GAME_START;
        tData_t.vecData = tNotifyGameStart_t.toBinBuffer();
        tRespMessage.tGameData.vecRespAllData.push(tData_t);
        // console.log(tNotifyGameStart_t.listChairNo);
    })
    console.log(listChairNo);
    tRespMessage.eMsgType = TarsGame.EGameMsgType.E_RESPALL_DATA;
    tRespMessage.nTimeout = 20;
    current.sendResponse(0, tRespMessage);
});

// 超时
emitter_room.on(TarsGame.E_GAME_MSGID.GAMETIMEOUT, function (current, tReqRoomMsg, tRespMessage) {
    logger.info("TarsGame.E_GAME_MSGID.GAMETIMEOUT");
    doGameAction(current, tReqRoomMsg, tRespMessage);
});

// 回合结束
emitter_room.on(TarsGame.E_GAME_MSGID.GAMEFINISH, function (current, tReqRoomMsg, tRespMessage) {
    logger.info("TarsGame.E_GAME_MSGID.GAMEFINISH");
    // const gameData = mapTableMng.get(tReqRoomMsg.sTableNo);
    // handleGameFinish(gameData);
});

// 解散游戏
emitter_room.on(TarsGame.E_GAME_MSGID.GAMEDISMISS, function (current, tReqRoomMsg, tRespMessage) {
    logger.info("TarsGame.E_GAME_MSGID.GAMEDISMISS");
    mapTableMng.delete(tReqRoomMsg.sTableNo);
});

// 游戏结束
emitter_room.on(TarsGame.E_GAME_MSGID.GAMEOVER, function (current, tReqRoomMsg, tRespMessage) {
    logger.info("TarsGame.E_GAME_MSGID.GAMEOVER");

    const gameData = mapTableMng.get(tReqRoomMsg.sTableNo);




    mapTableMng.delete(tReqRoomMsg.sTableNo);
});

// 游戏动作
emitter_room.on(TarsGame.E_GAME_MSGID.GAMEACTION, function (current, tReqRoomMsg, tRespMessage) {
    logger.info("TarsGame.E_GAME_MSGID.GAMEACTION");
    doGameAction(current, tReqRoomMsg, tRespMessage);
});

// 当前回合结束
function doGameAction(current, tReqRoomMsg, tRespMessage) {
    const gameData = mapTableMng.get(tReqRoomMsg.sTableNo);
    logger.info("handleGameAction:flag is ", gameData.roundInfo.flag);
    let res = handleGameAction(gameData);

    switch (gameData.roundInfo.flag) {
        case CM_ROUNDFLAG.GAME_SNATCHBANKER:       // 抢庄
            doSnatchbankerFinish(current, gameData, tRespMessage);
            break;
        case CM_ROUNDFLAG.GAME_CHOOSESCORE:        // 选分
            doChooseScoreFinish(current, gameData, tRespMessage)
            break;
        case CM_ROUNDFLAG.GAME_SELLBUYSCORE:       // 买卖分
            doChooseSellBuyFinish(current, gameData, tRespMessage)
            break;
        case CM_ROUNDFLAG.GAME_FINISH:              // 游戏结束
            doGameFinish(current, gameData, tRespMessage)
            break;
        default:
            logger.error("handleGameAction:the flag is error,flag is ", gameData.roundInfo.flag);
    }
}

// 抢庄结束
function doSnatchbankerFinish(current, gameData, tRespMessage) {
    logger.info("doSnatchbankerFinish");
    let listUserInfo = _.shuffle(gameData.userMng.listUserInfo);
    let userInfo = _.maxBy(listUserInfo, userInfo => { return userInfo.snatchbankerMutiple })
    logger.info(userInfo);

    // 玩家只有两人，下一回合将结束游戏
    if (gameData.userMng.listUserInfo.length == 2) {
        gameData.roundInfo.Update(CM_ROUNDFLAG.GAME_FINISH);
    } else {
        gameData.roundInfo.Update(CM_ROUNDFLAG.GAME_CHOOSESCORE);
    }

    const tNotifySBFinish_t = new CocklainStruct.TNotifySnatchbankerFinish();
    tNotifySBFinish_t.dealer = userInfo.chairNo;

    const tData_t = new TarsGame.TData();
    tData_t.nMsgID = CM_SERVERMSG.ES_GAME_SNATCHBANKERFINISH;
    tData_t.vecData = tNotifySBFinish_t.toBinBuffer();
    tRespMessage.tGameData.tNotifyData = tData_t;
    tRespMessage.eMsgType = TarsGame.EGameMsgType.E_NOTIFY_DATA;

    current.sendResponse(TarsGame.E_GAME_MSGID.GAMEACTION, tRespMessage);
}

// 选分结束
function doChooseScoreFinish(current, gameData, tRespMessage) {

}

// 买卖分结束
function doChooseSellBuyFinish(current, gameData, tRespMessage) {
    tRespMessage.eMsgType = TarsGame.EGameMsgType.E_NONE_DATA;
    current.sendResponse(TarsGame.E_GAME_MSGID.GAMEFINISH, tRespMessage);
}

// 发牌 请求游戏回合结束
function doGameFinish(current, gameData, tRespMessage) {
    logger.info("doGameFinish");

    // 返回游戏数据
    const tNotifyGameFinish_t = new CocklainStruct.TNotifyGameFinish();
    gameData.userMng.listUserInfo.map(
        userInfo => {
            // logger.info(userInfo);
            const tRoundResult_t = new CocklainStruct.TRoundResult();
            tRoundResult_t.cardInfo.cards.readFromObject(userInfo.arrCards);
            tRoundResult_t.cardInfo.chairNo = userInfo.chairNo;
            tRoundResult_t.cardPattern = userInfo.cocklainInfo.cocklainType;
            tRoundResult_t.winScore = 0;
            tRoundResult_t.remainScore = 0;
            // logger.info(tRoundResult_t);

            tNotifyGameFinish_t.listRoundResult.push(tRoundResult_t);
        }
    )

    logger.info(tNotifyGameFinish_t.listRoundResult);
    const tData_t = new TarsGame.TData();
    tData_t.nMsgID = CM_SERVERMSG.ES_GAME_FINISH;
    tData_t.vecData = tNotifyGameFinish_t.toBinBuffer();
    tRespMessage.eMsgType = TarsGame.EGameMsgType.E_NOTIFY_DATA;
    tRespMessage.tGameData.tNotifyData = tData_t;

    current.sendResponse(TarsGame.E_GAME_MSGID.GAMEFINISH, tRespMessage);
}


///////////////////////////////////////ClientMessage//////////////////////////////////////////////
// 玩家抢庄
emitter_client.on(CM_CLIENTMSG.EC_SNATCHBANKER, function (current, tReqRTMsg, tRespMessage) {
    logger.info("CM_CLIENTMSG.E_SNATCHBANKER");
    const gameData = mapTableMng.get(tReqRTMsg.sTableNo);
    // logger.info(tReqRTMsg);
    const tReqSnatchbanker_t = new CocklainStruct.TReqSnatchbanker.create(new TarsStream.TarsInputStream(tReqRTMsg.vecData));
    const tReqSnatchbanker = tReqSnatchbanker_t.toObject();
    logger.info(tReqRTMsg.nChairIdx, tReqSnatchbanker);

    // 处理玩家动作
    const handRes = handleSnatchbanker(gameData, tReqRTMsg.nChairIdx, tReqSnatchbanker.multiple);

    if (handRes == CM_RETCODE.E_COMMON_SUCCESS) {
        // 返回游戏数据
        const tNotifySnatchbanker_t = new CocklainStruct.TNotifySnatchbanker();
        tNotifySnatchbanker_t.chairNo = tReqRTMsg.nChairIdx;
        tNotifySnatchbanker_t.multiple = tReqSnatchbanker.multiple;

        const tData_t = new TarsGame.TData();
        tData_t.nMsgID = CM_SERVERMSG.ES_GAME_SNATCHBANKER;
        tData_t.vecData = tNotifySnatchbanker_t.toBinBuffer();
        tRespMessage.eMsgType = TarsGame.EGameMsgType.E_NOTIFY_DATA;
        tRespMessage.tGameData.tNotifyData = tData_t;

        logger.info(tNotifySnatchbanker_t);
    }

    // 检查是否抢庄完毕，是则通知RoomServer请求GAMEACTION
    let res = 0;
    if (gameData.userMng.CheckSnatchbanker()) {
        tRespMessage.nTimeout = 2;
        // res = TarsGame.E_GAME_MSGID.GAMEACTION;
    }
    current.sendResponse(res, tRespMessage);
});

// 玩家选底分
emitter_client.on(CM_CLIENTMSG.EC_CHOOSESCORE, function (current, tReqRTMsg, tRespMessage) {
    logger.info("CM_CLIENTMSG.E_GAME_CHOOSESCORE");
    const gameData = mapTableMng.get(tReqRTMsg.sTableNo);

    const tReqChooseScore_t = new CocklainStruct.TReqChooseScore.create(new TarsStream.TarsInputStream(tReqRTMsg.vecData));
    const tReqChooseScore = tReqChooseScore_t.toObject();

    // 处理玩家动作
    handleChooseScore(gameData, tReqRTMsg.nChairIdx, tReqChooseScore.chooseScore);

    // 返回游戏数据
    const tRespChooseScore_t = new CocklainStruct.TRespChooseScore();
    tRespChooseScore_t.chairIdx = tReqRTMsg.nChairIdx;
    tRespChooseScore_t.chooseScore = tReqSnatchbanker.chooseScore;


    const tData_t = new TarsGame.TData();
    tData_t.nMsgID = CM_SERVERMSG.ES_GAME_CHOOSESCORE;
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
emitter_client.on(CM_CLIENTMSG.EC_SELLSCORE, function (current, tReqRTMsg, tRespMessage) {
    logger.info("CM_CLIENTMSG.EC_SELLSCORE");
    const gameData = mapTableMng.get(tReqRTMsg.sTableNo);

    const tReqSellScore_t = new CocklainStruct.TReqSellScore.create(new TarsStream.TarsInputStream(tReqRTMsg.vecData));
    const tReqSellScore = tReqSellScore_t.toObject();

    // 处理玩家动作
    handleSellSocre(gameData, tReqRTMsg.nChairIdx, tReqSellScore.score);

    // 返回游戏数据
    const tRespChooseScore_t = new CocklainStruct.TRespChooseScore();
    tRespChooseScore_t.chairIdx = tReqRTMsg.nChairIdx;
    tRespChooseScore_t.chooseScore = tReqSnatchbanker.chooseScore;


    const tData_t = new TarsGame.TData();
    tData_t.nMsgID = CM_SERVERMSG.ES_GAME_CHOOSESCORE;
    tData_t.vecData = tRespSnatchbanker_t.toBinBuffer();
    tRespMessage.eMsgType = TarsGame.EGameMsgType.E_NOTIFY_DATA;
    tRespMessage.tGameData.tNotifyData = tData_t;

    current.sendResponse(0, tRespMessage);
});

// 玩家买分
emitter_client.on(CM_CLIENTMSG.EC_BUYSCORE, function (current, tReqRTMsg, tRespMessage) {
    logger.info("CM_CLIENTMSG.EC_BUYSCORE");
    const gameData = mapTableMng.get(tReqRTMsg.sTableNo);

    const tReqBuyScore_t = new CocklainStruct.TReqBuyScore.create(new TarsStream.TarsInputStream(tReqRTMsg.vecData));
    const tReqBuyScore = tReqBuyScore_t.toObject();

    // 处理玩家动作
    handleBuySocre(gameData, tReqRTMsg.nChairIdx, tReqBuyScore.chairIdx);

    // 返回游戏数据
    const tRespChooseScore_t = new CocklainStruct.TRespChooseScore();
    tRespChooseScore_t.chairIdx = tReqRTMsg.nChairIdx;
    tRespChooseScore_t.chooseScore = tReqSnatchbanker.chooseScore;


    const tData_t = new TarsGame.TData();
    tData_t.nMsgID = CM_SERVERMSG.ES_GAME_CHOOSESCORE;
    tData_t.vecData = tRespSnatchbanker_t.toBinBuffer();
    tRespMessage.eMsgType = TarsGame.EGameMsgType.E_NOTIFY_DATA;
    tRespMessage.tGameData.tNotifyData = tData_t;

    current.sendResponse(0, tRespMessage);
});


// 玩家断线重连获取游戏数据
emitter_client.on(CM_CLIENTMSG.EC_GETGAMEDATA, function (current, tReqRTMsg, tRespMessage) {
    logger.info("CM_CLIENTMSG.EC_GETGAMEDATA");


});
