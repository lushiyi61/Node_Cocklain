
var events = require('events');
var TarsStream = require('@tars/stream');
var NodeMessage = require("../tars/NodeMessage").NodeMessage;
var GAMEENUM = require("../tars/GameEnum").GAMEENUM;
var CocklainStruct = require("../tars/CocklainStruct").CocklainStruct;

// var Data = require("../data/data").Data;
// var Logic = require("../logic/logic").Logic;


var Events = {};
module.exports.Events = Events;

var mapTableInfo = {};

var emitter = new events.EventEmitter();
emitter.on(CmdEnumTars.SERVER_E.GAMESTART, function (current, msgIn, msgOut) {
//     console.log("CmdEnumTars.SERVER_E.GAMESTART");
//     // // 解析输入数据
//     // let reqGameStart_t = new MahjongStructTars.ReqGameStart_t.create(new TarsStream.InputStream(msgIn.msgData));
//     // let reqGameStart = reqGameStart_t.toObject();
//     // let deskNo = reqGameStart.deskNo;

//     // mapMahjongInfo[deskNo] = new Data(reqGameStart.rules);

//     // // 执行动作
//     // Logic.DoReqGameStart(mapMahjongInfo[deskNo]);

//     // // 返回数据打包
//     // let respGameStart_t = new MahjongStructTars.RespGameStart_t();
//     // respGameStart_t.dataPrivate.readFromObject(mapMahjongInfo[deskNo].dataPrivate.GetObject());
//     // respGameStart_t.rounds.readFromObject(mapMahjongInfo[deskNo].rounds);
//     // respGameStart_t.cardWall.cardNum = mapMahjongInfo[deskNo].cardWall.cardList.length;
//     // respGameStart_t.cardWall.endNum = mapMahjongInfo[deskNo].cardWall.endNum;
//     // respGameStart_t.cardWall.dealer = mapMahjongInfo[deskNo].cardWall.dealer;
//     // respGameStart_t.cardWall.dice1 = mapMahjongInfo[deskNo].cardWall.dice1;
//     // respGameStart_t.cardWall.dice2 = mapMahjongInfo[deskNo].cardWall.dice2;
//     // msgOut.msgData = respGameStart_t.toBinBuffer();

//     // // console.log("mapMahjongInfo：", mapMahjongInfo[deskNo]);
//     current.sendResponse(0, msgOut);
// });

// emitter.on(CmdEnumTars.SERVER_E.GAMEACTION, function (current, msgIn, msgOut) {
//     console.log("CmdEnumTars.SERVER_E.GAMEACTION");
//     // 解析输入数据
//     let reqMahjongAction_t = new MahjongStructTars.ReqMahjongAction_t.create(new TarsStream.InputStream(msgIn.msgData));
//     let reqMahjongAction = reqMahjongAction_t.toObject();
//     console.log(reqMahjongAction);
//     let deskNo = reqMahjongAction.deskNo;

//     // 执行动作
//     let result = Logic.DoReqMahjongAction(mapMahjongInfo[deskNo], reqMahjongAction);

//     // 返回数据打包
//     let respMahjongAction_t = new MahjongStructTars.RespMahjongAction_t();
//     respMahjongAction_t.action = reqMahjongAction.action;
//     respMahjongAction_t.deskIdx = reqMahjongAction.deskIdx;
//     respMahjongAction_t.card = reqMahjongAction.card;
//     respMahjongAction_t.rounds.readFromObject(mapMahjongInfo[deskNo].rounds);
//     msgOut.msgData = respMahjongAction_t.toBinBuffer();

//     console.log("当前回合状态：", mapMahjongInfo[deskNo].rounds);
    current.sendResponse(result, msgOut);
});

emitter.on(CmdEnumTars.SERVER_E.GAMEFINNISH, function (current, msgIn, msgOut) {
    console.log("CmdEnumTars.SERVER_E.GAMEFINNISH");
    // // 解析输入数据
    // let reqMahjongAction_t = new MahjongStructTars.ReqMahjongAction_t.create(new TarsStream.InputStream(msgIn.msgData));
    // let reqMahjongAction = reqMahjongAction_t.toObject();


    // // 返回数据打包
    // let respMahjongAction = "";
    // let respMahjongAction_t = new MahjongStructTars.RespMahjongAction_t();
    // respMahjongAction_t.readFromObject(respMahjongAction);
    // msgOut.msgData = respMahjongAction_t.toBinBuffer();

    // console.log("mapMahjongInfo：", mapMahjongInfo[deskNo]);
    current.sendResponse(0, msgOut);
});

const DoMessage = function (current, msgIn, msgOut) {
    // 校验协议版本号
    if(!this.CheckVersion(msgIn.nVer)){

        current.sendResponse(-99, msgOut);
        return;
    }

    console.log("receive a message which msgCmd is ", msgIn.nCmd);
    emitter.emit(msgIn.nCmd, current, msgIn, msgOut);
}

const CheckVersion = function(nVer){
    if(nVer >= 1){
        return true;
    }
    return false;
}

Events.DoMessage = DoMessage;


