// import {TarsStream}  from '@tars/stream';


// /**
//  * 消息通用处理
//  */
// class GM_MsgLogic {
//     current: any;
//     reqMsgStream: ArrayBuffer;

//     constructor(current: any, tReqMessage: any, tRespMessage: any) {
//         this.current = current;

//         this.reqMsgStream = null;
//         if (null != tReqMessage) {
//             this.reqMsgStream = new TarsStream.TarsInputStream(tReqMessage.vecData);
//         }

//         this.tRespMessage = tRespMessage;
//     }

//     setClientMsg(eMsgType, nMsgID, tarsData = null) {
//         if (tarsData != null) {
//             this.tRespMessage.eMsgType = eMsgType;
//             this.tRespMessage.stGameData.stNotifyData.nMsgID = nMsgID;
//             this.tRespMessage.stGameData.stNotifyData.vecData = tarsData.toBinBuffer();
//         }
//     }

//     responseFail(iRet) {
//         this.current.sendResponse(iRet, this.tRespMessage);
//     }

//     setCountdown(timeout) {
//         this.tReqMessage.nTimeout = timeout;
//     }

//     response(timeout = 0) {
//         if (timeout != 0) {
//             this.tReqMessage.nTimeout = timeout;
//         }

//         this.current.sendResponse(0, this.tRespMessage);
//     }
// }
