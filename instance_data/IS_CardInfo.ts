import * as _ from "lodash";
import { CM_CARDFOLLOW, CM_CARDFUNCTION } from "../comm_enum/CM_CardType";

/**
 * 牌数据类
 * ==================
 */
export class IS_CardInfo {
    dealer: number;         // 庄家座位号
    cardList: number[];     // 剩余牌墙列表

    constructor() {
        this.dealer = 0;                // 庄家座位号
        this.InitCardList();
    }

    private InitCardList(): void {
        this.cardList = [];             // 剩余牌墙列表   
        // 获取四个花色
        CM_CARDFUNCTION.CARD_FOLLOW.map(
            follow => {
                // 获取所有牌
                CM_CARDFUNCTION.CARD_ALL.map(
                    card => {
                        let newCard = card | follow;
                        this.cardList.push(newCard);
                    }
                )
            }
        );

        this.cardList = _.shuffle(this.cardList);
    };

    CalculateDealer(dealer?: number): void {
        if (dealer != undefined) {
            this.dealer = dealer;
        }
    };

    DrawCard(drawNum: number = 1): number[] {
        let drawList: number[] = [];

        for (let i = 0; i < drawNum; i++) {
            drawList.push(this.cardList.shift());
        }

        return drawList;
    };

};
