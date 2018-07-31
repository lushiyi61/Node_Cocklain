import _ = require("lodash");
import { CM_CARDTYPE } from "../comm_enum/CM_CardType";
import { CM_CARDPATTERN } from "../comm_enum/CM_CardPattern";
import { IF_CocklainInfo } from "../instance_data/IF_CocklainInfo";





/**
 * 返回计算结果
 * ===========================
 * @param arrCards 手牌
 */
export function caleCardPattern(arrCards: number[]): IF_CocklainInfo // 计算牌型
{
    // 检查JQK(五花牛)
    if (this.checkJQK(arrCards)) {
        return {
            cocklainType: CM_CARDPATTERN.CP_5HUANIU,
            cardBig: _.max(arrCards)
        }
    }

    // 检查五小牛
    if (this.check5XiaoNiu(arrCards)) {
        return {
            cocklainType: CM_CARDPATTERN.CP_5XIAONIU,
            cardBig: _.max(arrCards)
        }
    }

    // 检查同花色
    let bTonghua = this.checkTonghua(arrCards);
    // 检查顺子
    let bShunzi = this.checkShunzi(arrCards);

    if (bTonghua && bShunzi) {
        return {
            cocklainType: CM_CARDPATTERN.CP_TONGHUASHUN,
            cardBig: _.max(arrCards)
        }
    }

    // 检查炸弹
    if (this.checkZhadan(arrCards)) {
        let tmpDict = _.groupBy(arrCards, card => { return card & 0xf })
        let tmpList = _.filter(tmpDict, o => { return o.length == 4 });
        return {
            cocklainType: CM_CARDPATTERN.CP_ZHADAN,
            cardBig: _.max(tmpList.pop())
        }
    }

    // 检查银牛
    if (this.checkYinNiu(arrCards)) {
        return {
            cocklainType: CM_CARDPATTERN.CP_YINNIU,
            cardBig: _.max(arrCards)
        }
    }

    if (bTonghua) {
        return {
            cocklainType: CM_CARDPATTERN.CP_TONGHUA,
            cardBig: _.max(arrCards)
        }
    }

    if (bShunzi) {
        return {
            cocklainType: CM_CARDPATTERN.CP_SHUNZI,
            cardBig: _.max(arrCards)
        }
    }

    // 检查葫芦牛
    if (this.checkHulu(arrCards)) {
        let tmpDict = _.groupBy(arrCards, card => { return card & 0xf });
        let tmpList = _.filter(tmpDict, o => { return o.length == 3 });
        return {
            cocklainType: CM_CARDPATTERN.CP_HULU,
            cardBig: _.max(tmpList.pop())
        }
    }

    return {
        cocklainType: this.caleNiu(arrCards),
        cardBig: _.max(arrCards)
    }
}

// 五花牛：五张牌都是J、Q、K组成的牌型。
function checkJQK(arrCards: number[]): boolean {
    const tmpList = _.filter(arrCards, card => {
        return [
            CM_CARDTYPE.CARD_JACK,
            CM_CARDTYPE.CARD_QUEEN,
            CM_CARDTYPE.CARD_KING,
        ].indexOf(card & 0xf) >= 0
    })
    return tmpList.length == 5 ? false : true;
}

// 五小牛：每张牌均＜5，且5张牌相加≤10的牌型
function check5XiaoNiu(arrCards: number[]): boolean {
    let sum = 0;
    for (let card of arrCards) {
        sum += (card & 0xf);
    }

    if (10 < sum) {
        return false;
    }

    return true;
}

// 顺子牛：手牌为五张连续的牌型
function checkShunzi(arrCards: number[]): boolean {
    let sum = 0;
    let listCard = [];
    for (let card of arrCards) {
        let cardNum = card & 0xf;
        sum += cardNum;
        listCard.push(cardNum);
    }

    if (sum % 5 != 0) {
        return false;
    }

    const middleCard = sum / 5;
    const tmpList = [middleCard - 2, middleCard - 1, middleCard, middleCard + 1, middleCard + 2];
    for (let card of tmpList) {
        if (listCard.indexOf(card) < 0) {
            return false;
        }
    }

    return true;
}

// 同花牛：五张同个花色且连续序列号的牌型
function checkTonghua(arrCards: number[]): boolean {
    let tmpDict = _.groupBy(arrCards, card => { return card & 0x00f0 })
    let tmpList = _.filter(tmpDict, o => { return o.length == 5 });
    if (tmpList.length != 1) {
        return false;
    }

    return true;
}

// 炸弹牛：四张牌相同的牌型
function checkZhadan(arrCards: number[]): boolean {
    let tmpDict = _.groupBy(arrCards, card => { return card & 0xf })
    let tmpList = _.filter(tmpDict, o => { return o.length == 4 });
    if (tmpList.length != 1) {
        return false;
    }

    return true;
}

// 银牛：一个10，其他为JQK（猜测）
function checkYinNiu(arrCards: number[]): boolean {
    let tmpList1 = _.filter(arrCards, card => { return (card & 0xf) > CM_CARDTYPE.CARD_TEN });
    if (tmpList1.length != 4) {
        return false;
    }
    let tmpList2 = _.filter(arrCards, card => { return (card & 0xf) == CM_CARDTYPE.CARD_TEN });
    if (tmpList2.length != 1) {
        return false;
    }

    return true;
}

// 葫芦牛：三张牌+一个对子的牌型。
function checkHulu(arrCards: number[]): boolean {
    let tmpDict = _.groupBy(arrCards, card => { return card & 0xf });
    let tmpList = _.filter(tmpDict, o => { return o.length >= 2 });

    if (tmpList.length != 2) {
        return false;
    }

    return true;
}

// 算牛
function caleNiu(arrCards: number[]): number {
    let tmpList = _.filter(arrCards, card => {
        return (card & 0xf) < CM_CARDTYPE.CARD_TEN
    })

    tmpList = tmpList.map(card => { return card & 0xf })
    switch (tmpList.length) {
        case 5:
            return this.checkFiveCard(tmpList);
        case 4:
            return this.checkFourCard(tmpList);
        case 3:
            return this.checkThreeCard(tmpList);
        case 2:
            return this.checkTwoCard(tmpList);
        case 1:
            return this.checkOneCard(tmpList);
        case 0:
            return CM_CARDPATTERN.CP_NIUNIU; // 牛牛
    }
}


//////////////////////////////////////////////////////////////
// 牌列表中的牌 1- 9
function checkFiveCard(arrCards: number[]): number {
    const sum = _.sum(arrCards);
    // 2 + 3
    const sumElse = sum % 10;
    if (sumElse == 0) {
        for (let card of arrCards) {
            const card1 = 10 - card;
            if (arrCards.indexOf(card1) >= 0) {
                // 返回牛牛
                return CM_CARDPATTERN.CP_NIUNIU;
            }
        }
    } else {
        for (let card of arrCards) {
            const card1 = (10 + sumElse - card) % 10;
            if (arrCards.indexOf(card1) >= 0) {
                // 返回牛N
                return CM_CARDPATTERN.CP_NIU0 + sumElse;
            }
        }
    }


    return CM_CARDPATTERN.CP_NIU0;
}

function checkFourCard(arrCards: number[]): number {
    const sum = _.sum(arrCards);
    // 1 + 3 sumElse > 0
    const sumElse = sum % 10;
    if (arrCards.indexOf(sumElse) > 0) {
        return CM_CARDPATTERN.CP_NIU0 + sumElse;
    }
    // 2 + 2   12 <= sum <= 28
    if (sum >= 12 && sum <= 28) {
        // 检查合法性(任意两张相加=10)
        for (let card of arrCards) {
            const card1 = 10 - card;
            if (arrCards.indexOf(card1) >= 0) {
                // 返回牛N
                if (sumElse == 0) {
                    return CM_CARDPATTERN.CP_NIUNIU;
                }

                return CM_CARDPATTERN.CP_NIU0 + sumElse;
            }
        }
    }

    return CM_CARDPATTERN.CP_NIU0;
}

function checkThreeCard(arrCards: number[]): number {
    const sumElse = _.sum(arrCards) % 10;
    if (sumElse == 0) {
        return CM_CARDPATTERN.CP_NIUNIU;
    }

    if (sumElse != 0 && arrCards.indexOf(sumElse) < 0) {
        return CM_CARDPATTERN.CP_NIU0;
    }

    return CM_CARDPATTERN.CP_NIU0 + sumElse;
}

function checkTwoCard(arrCards: number[]): number {
    const sumElse = _.sum(arrCards) % 10;
    if (sumElse == 0) {
        return CM_CARDPATTERN.CP_NIUNIU;
    }

    return CM_CARDPATTERN.CP_NIU0 + sumElse;
}

function checkOneCard(arrCards: number[]): number {
    const sumElse = _.sum(arrCards) % 10;
    return CM_CARDPATTERN.CP_NIU0 + sumElse;
}
