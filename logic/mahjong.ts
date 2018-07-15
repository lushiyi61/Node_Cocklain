/**
 * 
 * 
 */
import { CARDTYPE } from "../enum/cardType";
import { GAMETYPE } from "../enum/gameType";
import * as _ from "lodash";
import { CardWallValue, DataPrivate, RulesValue } from "../data/data";
import { GetOperatorList } from "../logic/common";

export class Mahjong {
    /**
     * 返回牌墙结构
     * @param gameType 游戏类型
     */
    static GetCardWallList(gameType: number) {
        let cardWallList: number[] = [];
        for (let i = 0; i < 4; i++) {  // N * 4
            // 1-9 序数牌
            for (let j = 1; j <= 9; j++) {
                cardWallList.push(CARDTYPE.CARD_NUMB | CARDTYPE.TILE_WAN + j); // 万
                cardWallList.push(CARDTYPE.CARD_NUMB | CARDTYPE.TILE_SUO + j); // 索
                cardWallList.push(CARDTYPE.CARD_NUMB | CARDTYPE.TILE_BIN + j); // 饼
            }

            // 风牌 东南西北
            if ((GAMETYPE.GAME_WIN & gameType) == GAMETYPE.GAME_WIN) {
                for (let j = 1; j <= 4; j++) {
                    cardWallList.push(CARDTYPE.CARD_CHAR | CARDTYPE.TILE_WIN + j);
                }
            }

            // 箭牌 中发白
            if ((GAMETYPE.GAME_ARR & gameType) == GAMETYPE.GAME_ARR) {
                for (let j = 1; j <= 3; j++) {
                    cardWallList.push(CARDTYPE.CARD_CHAR | CARDTYPE.TILE_ARR + j);
                }
            } // 或只有红中
            else if ((GAMETYPE.GAME_ZHO & gameType) == GAMETYPE.GAME_ZHO) {
                cardWallList.push(CARDTYPE.CARD_CHAR | CARDTYPE.TILE_ARR + 1); // 红中
            }
        }

        // 花牌 春夏秋冬梅兰竹菊 8 * 1
        if ((GAMETYPE.GAME_FLOW & gameType) == GAMETYPE.GAME_FLOW) {
            for (let j = 1; j <= 8; j++) {
                cardWallList.push(CARDTYPE.CARD_FLOW + j);
            }
        }

        return _.shuffle(cardWallList);
    };

    /**
     * 玩家从牌墙摸牌
     * @param cardWall 牌墙结构
     * @param num 摸牌数量？默认1个
     * @param bTail 补牌？默认false
     */
    static DrawCards(cardWall: CardWallValue, num: number = 1, bTail: boolean = false) {
        let cardList: number[] = [];

        if (bTail) {
            cardWall.endNum += num;
            for (let i = 0; i < num; i++) {
                cardList.push(cardWall.cardList.pop());
            }
        } else {
            for (let i = 0; i < num; i++) {
                cardList.push(cardWall.cardList.shift());
            }
        }
        return cardList;
    };

    /**
     * 给玩家发手牌，目前只支持13张手牌
     * @param cardWall 牌墙列表
     * @param DataPrivate 玩家私有数据
     * @param rules 玩法规则
     */
    static LicensingCard(cardWall: CardWallValue, dataPrivate: DataPrivate, rules: RulesValue) {
        let operatorList: number[] = GetOperatorList(cardWall.dealer, rules.playerNum);

        // 0,1,2 每人摸四张牌，3 每人摸一张牌 发4轮牌
        for (let i: number = 0; i < 4; i++) {
            for (let idx of operatorList) {
                if (i == 3) {
                    dataPrivate.AddCardToHandList(idx, this.DrawCards(cardWall));
                } else {
                    dataPrivate.AddCardToHandList(idx, this.DrawCards(cardWall, 4));
                }
            }
        }
    };
};