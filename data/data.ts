/**
 * 麻将游戏数据类
 * 
 */
import { ACTIONTYPE } from "../enum/actionType";
import { GetOperatorList } from "../logic/common";
import { CARDTYPE } from "../enum/cardType";

export class Data {
    rules: Rules;
    rounds: Rounds;
    cardWall: CardWall;
    dataPrivate: DataPrivate;
    dataPublic: DataPublic;
    userInfo: UserInfo;
    constructor(rules: RulesValue) {
        this.rules = new Rules(rules);
        this.rounds = new Rounds();
        this.cardWall = new CardWall();
        this.userInfo = new UserInfo(rules.playerNum);
        this.dataPublic = new DataPublic(rules.playerNum);
        this.dataPrivate = new DataPrivate(rules.playerNum);
    };

};
//=============================================================================

/**
 * 游戏规则
 */
export interface RulesValue {
    cardType: number;        // 默认108张序数牌 万索饼
    playerNum: number;       // 玩家数量
};

class Rules {
    cardType: number;
    playerNum: number;
    constructor(rules: RulesValue) {
        this.cardType = rules.cardType;
        this.playerNum = rules.playerNum
    }
};

/** 
 * 当前牌桌回合数据 
 */
interface RoundsValue {
    number: number;      // 回合 更新计次
    flag: number;        // 回合 标志
    card: number;        // 牌（出的牌、摸的牌）
    deskIdx: number;     // 当前执行座位号
};

class Rounds {
    number: number;
    flag: number;
    card: number;
    deskIdx: number;
    constructor() {
        this.number = 0;
        this.flag = 0;
        this.card = 0;
        this.deskIdx = 0;
    };
    Update(flag: number, card: number, deskIdx?: number) {
        this.number += 1;
        this.flag = flag;
        this.card = card;
        if (deskIdx != undefined) {
            this.deskIdx = deskIdx;
        }
    };
};

/**
 * 牌墙数据
 */
export interface CardWallValue {
    cardList: number[];     // 剩余牌墙列表
    endNum: number;         // 补牌数（尾部摸牌数量）
    dealer: number;         // 庄家座位号
    dice1: number;          // 骰子1
    dice2: number;          // 骰子2
};

class CardWall {
    cardList: number[];
    endNum: number;
    dealer: number;
    dice1: number;
    dice2: number;
    constructor() {
        let cardWall: CardWallValue = {
            cardList: [],
            endNum: 0,
            dealer: 0,
            dice1: 0,
            dice2: 0,
        };
        this.cardList = cardWall.cardList;
        this.endNum = cardWall.endNum;
        this.dealer = cardWall.dealer;
        this.dice1 = cardWall.dice1;
        this.dice2 = cardWall.dice2;
    }
};

/**
 * 牌桌私有数据
 */
export interface DataPrivateValue {
    handList: number[];     // 玩家手牌列表
    tingList: number[];     // 玩家听牌列表
};

/**
 * 建立一块玩家私有数据存储区域，
 * N个玩家
 */
export class DataPrivate {
    dataPrivate: any = {};
    constructor(playerNum: number) {
        for (let idx = 0; idx < playerNum; idx++) {
            let tmp: DataPrivateValue = { handList: [], tingList: [] };
            this.dataPrivate[idx] = tmp;
        }
    };
    AddCardToHandList(idx: number, cardList: number[]) {
        this.dataPrivate[idx].handList.push(...cardList);
    };
    UpdateHandList(idx: number, cardIn: number, cardOut: number[]) {
        if (cardIn != CARDTYPE.CARD_MUSK) {
            this.dataPrivate[idx].handList.push(cardIn);
        }
        cardOut.forEach(card => {
            let i = this.dataPrivate[idx].handList.indexOf(card);
            this.dataPrivate[idx].handList.splice(i, 1);
        });
    };
    GetObject() {
        return this.dataPrivate;
    }
};

/**
 * 牌桌公有数据
 */
export interface MingValue {
    action: number;
    from: number;
    card: number;
    cardList: number[],
};

export interface DataPublicValue {
    mingList: number[];         // 玩家鸣牌列表
    discardList: number[];      // 玩家已出牌列表
    tingFlag: boolean;          // 玩家听牌状态
};

export class DataPublic {
    dataPublic: any = {};
    constructor(playerNum: number) {
        for (let idx = 0; idx < playerNum; idx++) {
            let tmp: DataPublicValue = { mingList: [], discardList: [], tingFlag: false };
            this.dataPublic[idx] = tmp;
        }
    };
    AddCardToDiscardList(idx: number, card: number) {
        this.dataPublic[idx].discardList.push(card);
    };
    AddMingToMingList(idx: number, ming: MingValue) {
        this.dataPublic[idx].mingList.push(ming);
    };
    UpdateUserTingAction(idx: number) {
        this.dataPublic[idx].tingFlag = true;
    };
    UpdatePengToGangB(idx: number, card: number) {
        this.dataPublic[idx].mingList.forEach(element => {
            if (element.action == ACTIONTYPE.ACTION_PENG && element.card == card) {
                element.action = ACTIONTYPE.ACTION_GANG_B;
                element.cardList.push(card);
            }
        });
    };
    CheckCanGangB(idx: number, card: number): boolean {
        this.dataPublic[idx].mingList.forEach(element => {
            if (element.action == ACTIONTYPE.ACTION_PENG && element.card == card) {
                return true;
            }
        });
        return false;
    }
    GetObject() {
        return this.dataPublic;
    };
};

/**
 * 玩家操作标志
 */
interface UserInfoValue {
    CanAction: number;      // 玩家可执行动作
    DoAction: number;       // 玩家已选择动作
    tingList: number[];     // 玩家出哪些牌，就可以听牌
    huedInfo: any;          // 玩家可以胡哪些牌key:tingCard，value:huedList
};

interface HuedListValue {
    huedList: number[];     // 玩家可以胡哪些牌
}

/**
 * （内部使用）记录当前回合，该玩家
 * 1、可操作的集合
 * 2、已选操作
 */
class UserInfo {
    userInfo: any = {};
    playerNum: number = 0;
    constructor(playerNum: number) {
        this.playerNum = playerNum;
        for (let idx = 0; idx < playerNum; idx++) {
            let tmp: UserInfoValue = {
                CanAction: ACTIONTYPE.ACTION_NONE,
                DoAction: ACTIONTYPE.ACTION_NONE,
                tingList: [],
                huedInfo: {},
            };
            this.userInfo[idx] = tmp;
        }
    };
    InitUserAction() {
        for (const key in this.userInfo) {
            this.userInfo[key].DoAction = ACTIONTYPE.ACTION_NONE;
        }
    };
    UpdateUserDoAction(idx: number, flag: number) {
        this.userInfo[idx].DoAction = flag;
    };
    CheckUserDoAction() {
        for (const key in this.userInfo) {
            if (this.userInfo[key].DoAction == ACTIONTYPE.ACTION_NONE) {
                return false;
            }
        }
        return true;
    };
    GetUserDoAction(idx: number, card: number) {
        // 获取先后顺序
        let operatorList: number[] = GetOperatorList(idx, this.playerNum);
        let mahjongAction: any = {
            deskIdx: 0,
            action: ACTIONTYPE.ACTION_NONE,
            card: card,
        }
        operatorList.forEach(key => {
            if (this.userInfo[key].DoAction > mahjongAction.action) {
                mahjongAction.action = this.userInfo[key].DoAction;
                mahjongAction.deskIdx = key;
            }
        });

        // console.log(operatorList, mahjongAction);
        return mahjongAction;
    };
};

