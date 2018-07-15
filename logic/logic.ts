/**
 * 棋牌游戏主控
 */
import { Mahjong } from "./mahjong";
import { Data } from "../data/data";
import { GAMEFLAG } from "../enum/gameFlag";
import { ACTIONTYPE } from "../enum/actionType";
import { Action } from "./action";

export class Logic {


    static DoReqGameStart(data: Data) {
        // 开局洗牌
        data.cardWall.cardList = Mahjong.GetCardWallList(data.rules.cardType);
        // 首轮发牌
        Mahjong.LicensingCard(data.cardWall, data.dataPrivate, data.rules);
        // 首轮摸牌（更新回合信息）
        let cardList: number[] = Mahjong.DrawCards(data.cardWall);
        data.rounds.Update(GAMEFLAG.GAME_DISCARD_WAIT, cardList[0], data.cardWall.dealer);
        // 判断玩家听牌，和胡牌情况
    };


    static DoReqMahjongAction(data: Data, mahjongAction: any) {
        let result = 1;
        if (mahjongAction.action == ACTIONTYPE.ACTION_PLAY) {
            // 校验动作是否合法

            // 执行动作 
            Action.DoActionPlay(data, mahjongAction);

            // 返回成功
            result = 0;
        }
        else if (mahjongAction.action == ACTIONTYPE.ACTION_PASS) {
            // 执行动作 4、更新玩家可执行状态
            data.userInfo.UpdateUserDoAction(mahjongAction.deskIdx, mahjongAction.action);

            // 执行动作 6、检测玩家可执行状态，是否进入下一轮
            if (data.userInfo.CheckUserDoAction()) {
                Action.DoActionNextRound(data, mahjongAction);
                result = 0;
            } else {
                // 返回等待执行
                result = 1;
            }
        }
        // 吃碰明杠胡
        else if ([
            ACTIONTYPE.ACTION_CHI_E,
            ACTIONTYPE.ACTION_CHI_H,
            ACTIONTYPE.ACTION_CHI_M,
            ACTIONTYPE.ACTION_PENG,
            ACTIONTYPE.ACTION_GANG_M,
            ACTIONTYPE.ACTION_HUED
        ].indexOf(mahjongAction.action) != -1) {
            // 校验动作是否合法

            // 执行动作 4、更新玩家可执行状态
            data.userInfo.UpdateUserDoAction(mahjongAction.deskIdx, mahjongAction.action);

            // 执行动作 6、检测玩家可执行状态，是否进入下一轮
            if (data.userInfo.CheckUserDoAction()) {
                Action.DoActionNextRound(data, mahjongAction);
                result = 0;
            } else {
                // 返回等待执行
                result = 1;
            }
        }
        else if (mahjongAction.action == ACTIONTYPE.ACTION_GANG_B) {
            // 校验动作是否合法

            // 执行动作
            Action.DoActionGangB(data, mahjongAction);

            // 执行动作 6、检测玩家可执行状态，是否进入下一轮
            if (data.userInfo.CheckUserDoAction()) {
                Action.DoActionNextRound(data, mahjongAction);
                result = 0;
            } else {
                // 返回等待执行
                result = 1;
            }
        }
        else if (mahjongAction.action == ACTIONTYPE.ACTION_GANG_A) {
            // 校验动作是否合法

            // 执行动作
            Action.DoActionGangA(data, mahjongAction);

            // 返回成功
            result = 0;
        }
        else if (mahjongAction.action == ACTIONTYPE.ACTION_TING) {

        }
        else if (mahjongAction.action == ACTIONTYPE.ACTION_HUED) {

        }

        return result;
    };

};