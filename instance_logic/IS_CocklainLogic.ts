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
    const card = _.maxBy(arrCards, c => { return c & 0xf });
    let tmpCardList = _.filter(arrCards, c => { return (c & 0xf) == (card & 0xf) });
    tmpCardList.sort();

    // 检查JQK(五花牛)
    if (checkJQK(arrCards)) {
        return {
            cocklainType: CM_CARDPATTERN.CP_5HUANIU,
            cardBig: tmpCardList.pop()
        }
    }

    // 检查五小牛
    if (check5XiaoNiu(arrCards)) {
        return {
            cocklainType: CM_CARDPATTERN.CP_5XIAONIU,
            cardBig: tmpCardList.pop()
        }
    }

    // 检查同花色
    let bTonghua = checkTonghua(arrCards);
    // 检查顺子
    let bShunzi = checkShunzi(arrCards);

    if (bTonghua && bShunzi) {
        return {
            cocklainType: CM_CARDPATTERN.CP_TONGHUASHUN,
            cardBig: tmpCardList.pop()
        }
    }

    // 检查炸弹
    if (checkZhadan(arrCards)) {
        let tmpDict = _.groupBy(arrCards, card => { return card & 0xf })
        let tmpList = _.filter(tmpDict, o => { return o.length == 4 });
        tmpList.sort();
        return {
            cocklainType: CM_CARDPATTERN.CP_ZHADAN,
            cardBig: _.max(tmpList.pop())
        }
    }

    // 检查银牛
    if (checkYinNiu(arrCards)) {
        return {
            cocklainType: CM_CARDPATTERN.CP_YINNIU,
            cardBig: tmpCardList.pop()
        }
    }

    if (bTonghua) {
        return {
            cocklainType: CM_CARDPATTERN.CP_TONGHUA,
            cardBig: tmpCardList.pop()
        }
    }

    if (bShunzi) {
        return {
            cocklainType: CM_CARDPATTERN.CP_SHUNZI,
            cardBig: tmpCardList.pop()
        }
    }

    // 检查葫芦牛
    if (checkHulu(arrCards)) {
        let tmpDict = _.groupBy(arrCards, card => { return card & 0xf });
        let tmpList = _.filter(tmpDict, o => { return o.length == 3 });
        tmpList.sort();
        return {
            cocklainType: CM_CARDPATTERN.CP_HULU,
            cardBig: _.max(tmpList.pop())
        }
    }

    return {
        cocklainType: caleNiu(arrCards),
        cardBig: tmpCardList.pop()
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
    return tmpList.length == 5 ? true : false;
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
    tmpDict.length
    if (_.size(tmpDict) != 2 || tmpList.length != 2) {
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
    // console.log(tmpList);
    switch (tmpList.length) {
        case 5:
            return checkFiveCard(tmpList);
        case 4:
            return checkFourCard(tmpList);
        case 3:
            return checkThreeCard(tmpList);
        case 2:
            return checkTwoCard(tmpList);
        case 1:
            return checkOneCard(tmpList);
        case 0:
            return CM_CARDPATTERN.CP_NIUNIU; // 牛牛
    }
}


//////////////////////////////////////////////////////////////
/**
 * 有五张 1-9 
 * =========================
 * - 求和 2+3 类型
 *  - 无余，任意两张整十
 *  - 有余，且余牌在list中

 * @param arrCards 
 */
function checkFiveCard(arrCards: number[]): number {
    const sum = _.sum(arrCards);
    // 2 + 3
    const sumElse = sum % 10;
    if (sumElse == 0) {
        // 检查合法性(任意两张相加=10)
        if (checkTowCardSum(arrCards, 10)) {
            // 返回牛牛
            return CM_CARDPATTERN.CP_NIUNIU;
        }
    } else {
        // 检查合法性(任意两张相加=sumElse)
        if (checkTowCardSum(arrCards, sumElse)) {
            // 返回牛牛
            return CM_CARDPATTERN.CP_NIU0 + sumElse;
        }
    }


    return CM_CARDPATTERN.CP_NIU0;
}

/**
 * 有四张 1-9 
 * =========================
 * - 求和
 *  - 1+3 类型
 *      - 有余，且余牌在list中
 *  - 2+2 类型
 *      - 无/有余，任意两张整十
 * @param arrCards 
 */
function checkFourCard(arrCards: number[]): number {
    const sum = _.sum(arrCards);
    // 1 + 3 sumElse > 0
    const sumElse = sum % 10;
    // console.log(arrCards, sumElse, arrCards.indexOf(sumElse))
    if (arrCards.indexOf(sumElse) >= 0) {
        return CM_CARDPATTERN.CP_NIU0 + sumElse;
    }
    // 2 + 2   12 <= sum <= 28
    if (sum >= 12 && sum <= 28) {
        // 检查合法性(任意两张相加=10)
        if (checkTowCardSum(arrCards, 10)) {
            // 返回牛N
            if (sumElse == 0) {
                return CM_CARDPATTERN.CP_NIUNIU;
            }

            return CM_CARDPATTERN.CP_NIU0 + sumElse;
        }
    }

    return CM_CARDPATTERN.CP_NIU0;
}

/**
 * 有三张 1-9 
 * =========================
 * - 求和
 * - 有余，且余牌在list中
 * @param arrCards 
 */
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

/**
 * 有两张 1-9 求和
 * =========================
 * @param arrCards 
 */
function checkTwoCard(arrCards: number[]): number {
    const sumElse = _.sum(arrCards) % 10;
    if (sumElse == 0) {
        return CM_CARDPATTERN.CP_NIUNIU;
    }

    return CM_CARDPATTERN.CP_NIU0 + sumElse;
}

/**
 * 只有一张 1-9 求值
 * =========================
 * @param arrCards 
 */
function checkOneCard(arrCards: number[]): number {
    const sumElse = _.sum(arrCards);
    return CM_CARDPATTERN.CP_NIU0 + sumElse;
}

/**
 * 检查任意两张牌的和值（对10取余），是否等于目标值（对10取余）
 * =========================
 * @param arrCards 牌列表
 * @param sumElse 目标值
 */
function checkTowCardSum(arrCards: number[], sumElse: number): boolean {
    for (let card of arrCards) {
        const otherCard = (10 + sumElse - card) % 10;

        const tmpCardList = _.filter(arrCards, card => { return card == otherCard })
        if (card == otherCard && tmpCardList.length == 2) {
            return true;
        } else if (card != otherCard && tmpCardList.length == 1) {
            return true;
        } else {
            continue;
        }
    }

    return false;
}