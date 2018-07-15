import { Data, MingValue } from "../data/data";
import { GAMEFLAG } from "../enum/gameFlag";
import { ACTIONTYPE } from "../enum/actionType";
import { Mahjong } from "./mahjong";
import { CARDTYPE } from "../enum/cardType";


export class Action {
    static DoActionPlay(data: Data, mahjongAction: any) {
        // 执行动作 1、更新手牌数据
        data.dataPrivate.UpdateHandList(mahjongAction.deskIdx, data.rounds.card, [mahjongAction.card]);

        // 执行动作 5、更新回合数据
        data.rounds.Update(GAMEFLAG.GAME_DISCARD_OK, mahjongAction.card);

        // 执行动作 end、更新玩家可执行状态
        data.userInfo.UpdateUserDoAction(mahjongAction.deskIdx, mahjongAction.action)
    };

    static DoActionNextRound(data: Data, mahjongAction: any) {
        Object.assign(mahjongAction, data.userInfo.GetUserDoAction(data.rounds.deskIdx, data.rounds.card));

        // 下一回合（摸牌）
        if (mahjongAction.action == ACTIONTYPE.ACTION_PASS) {
            // 执行动作 2、更新玩家弃牌
            data.dataPublic.AddCardToDiscardList(mahjongAction.deskIdx, mahjongAction.card);

            // 执行动作 3、摸牌
            let cardList: number[] = Mahjong.DrawCards(data.cardWall);

            // 执行动作 5、更新回合数据
            data.rounds.Update(GAMEFLAG.GAME_DISCARD_WAIT, cardList[0], mahjongAction.deskIdx);
        }
        // 补杠成功（摸牌）
        else if (mahjongAction.action == ACTIONTYPE.ACTION_GANG_B) {
            // 执行动作 1、更新玩家手牌（不需要更新）

            // 执行动作 2、更新玩家鸣牌
            this.UpdatePlayerPublic(data, mahjongAction, []);

            // 执行动作 3、摸牌
            let cardList: number[] = Mahjong.DrawCards(data.cardWall, 1, true);

            // 执行动作 5、更新回合数据
            data.rounds.Update(GAMEFLAG.GAME_DISCARD_WAIT, cardList[0], mahjongAction.deskIdx);
        }
        // 明杠（摸牌）
        else if (mahjongAction.action == ACTIONTYPE.ACTION_GANG_M) {
            // 执行动作 1、更新玩家手牌
            this.UpdateHandListInWait(data, mahjongAction);

            // 执行动作 3、摸牌
            let cardList: number[] = Mahjong.DrawCards(data.cardWall, 1, true);

            // 执行动作 5、更新回合数据
            data.rounds.Update(GAMEFLAG.GAME_DISCARD_WAIT, cardList[0], mahjongAction.deskIdx);
        }
        else if ([
            ACTIONTYPE.ACTION_PENG,
            ACTIONTYPE.ACTION_CHI_H,
            ACTIONTYPE.ACTION_CHI_M,
            ACTIONTYPE.ACTION_CHI_E
        ].indexOf(mahjongAction.action) != -1) {
            // 执行动作 1、更新玩家手牌
            this.UpdateHandListInWait(data, mahjongAction);

            // 执行动作 5、更新回合数据
            data.rounds.Update(GAMEFLAG.GAME_DISCARD_WAIT, CARDTYPE.CARD_MUSK, mahjongAction.deskIdx);

        }
        // 执行动作 end 更新玩家可执行状态
        data.userInfo.InitUserAction();

    };

    static DoActionGangB(data: Data, mahjongAction: any) {
        // 执行动作 1、更新玩家手牌
        data.dataPrivate.UpdateHandList(mahjongAction.deskIdx, data.rounds.card, [mahjongAction.card]);

        // 执行动作 5、更新回合数据
        data.rounds.Update(GAMEFLAG.GAME_GANG_BU, mahjongAction.card, mahjongAction.deskIdx);

        // 执行动作 end、更新玩家可执行状态
        data.userInfo.UpdateUserDoAction(mahjongAction.deskIdx, mahjongAction.action);
    };


    static DoActionGangA(data: Data, mahjongAction: any) {
        const card = mahjongAction.card;
        const TmpCardList = [card, card, card, card];
        // 执行动作 1、更新手牌数据
        data.dataPrivate.UpdateHandList(mahjongAction.deskIdx, data.rounds.card, TmpCardList);

        // 执行动作 2、更新玩家鸣牌
        this.UpdatePlayerPublic(data, mahjongAction, TmpCardList);

        // 执行动作 3、摸牌
        let cardList: number[] = Mahjong.DrawCards(data.cardWall, 1, true);

        // 执行动作 5、更新回合数据
        data.rounds.Update(GAMEFLAG.GAME_DISCARD_WAIT, cardList[0], mahjongAction.deskIdx);

        // 执行动作 end 更新玩家可执行状态
        data.userInfo.InitUserAction();
    };

    static UpdateHandListInWait(data: Data, mahjongAction: any) {
        const card: number = mahjongAction.card;
        let cardList: number[] = [];
        if (mahjongAction.action == ACTIONTYPE.ACTION_CHI_H) {
            cardList = [card + 1, card + 2];
            data.dataPrivate.UpdateHandList(mahjongAction.deskIdx, CARDTYPE.CARD_MUSK, cardList);
        }
        else if (mahjongAction.action == ACTIONTYPE.ACTION_CHI_M) {
            cardList = [card + 1, card - 1]
            data.dataPrivate.UpdateHandList(mahjongAction.deskIdx, CARDTYPE.CARD_MUSK, cardList);
        }
        else if (mahjongAction.action == ACTIONTYPE.ACTION_CHI_E) {
            cardList = [card - 1, card - 2]
            data.dataPrivate.UpdateHandList(mahjongAction.deskIdx, CARDTYPE.CARD_MUSK, cardList);
        }
        else if (mahjongAction.action == ACTIONTYPE.ACTION_PENG) {
            cardList = [card, card]
            data.dataPrivate.UpdateHandList(mahjongAction.deskIdx, CARDTYPE.CARD_MUSK, cardList);
        }
        else if (mahjongAction.action == ACTIONTYPE.ACTION_GANG_M) {
            cardList = [card, card, card]
            data.dataPrivate.UpdateHandList(mahjongAction.deskIdx, CARDTYPE.CARD_MUSK, cardList);
        }

        this.UpdatePlayerPublic(data, mahjongAction, cardList);
    };

    static UpdatePlayerPublic(data: Data, mahjongAction: any, cardList: number[]) {
        let mingValue: MingValue = {
            card: mahjongAction.card,
            action: mahjongAction.action,
            from: data.rounds.deskIdx,
            cardList: cardList,
        };

        if (mahjongAction.action == ACTIONTYPE.ACTION_GANG_B) {
            data.dataPublic.UpdatePengToGangB(mahjongAction.deskIdx, mahjongAction.card);
        } else {
            data.dataPublic.AddMingToMingList(mahjongAction.deskIdx, mingValue);
        }
    };
}