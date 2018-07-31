export const enum CM_CARDTYPE {
    CARD_WILD = 0x1000,  // 癞子掩码(百搭牌)
    CARD_MUSK = 0xFFFF,  // 掩码

    CARD_ACE = 0x0001,          // A 
    CARD_TWO = 0x0002,          // 2
    CARD_THREE = 0x0003,        // 3
    CARD_FOUR = 0x0004,         // 4
    CARD_FIVE = 0x0005,         // 5
    CARD_SIX = 0x0006,          // 6
    CARD_SEVEN = 0x0007,        // 7
    CARD_EIGHT = 0x0008,        // 8
    CARD_NINE = 0x0009,         // 9
    CARD_TEN = 0x000A,          // 10
    CARD_JACK = 0x000B,         // J
    CARD_QUEEN = 0x000C,        // Q
    CARD_KING = 0x000D,         // K
    CARD_JOKER = 0x000E,        // 鬼
};

export const enum CM_CARDFOLLOW {
    CARD_SPADES = 0x0040,          // 黑桃,剑
    CARD_HEARTS = 0x0030,          // 红桃,红心
    CARD_CLUBS = 0x0020,           // 梅花,三叶草
    CARD_DIAMONDS = 0x0010,        // 方块,红方,钻石
    CARD_RED_JOKER = 0x0050,       // 大王
    CARD_BLACK_JOKER = 0x0060,     // 小王
}


/**
 * 牌组合控制
 */
export const CM_CARDFUNCTION = {
    CARD_ACE_NINE: [  // 1-9 算点数
        CM_CARDTYPE.CARD_ACE,
        CM_CARDTYPE.CARD_TWO,
        CM_CARDTYPE.CARD_THREE,
        CM_CARDTYPE.CARD_FOUR,
        CM_CARDTYPE.CARD_FIVE,
        CM_CARDTYPE.CARD_SIX,
        CM_CARDTYPE.CARD_SEVEN,
        CM_CARDTYPE.CARD_EIGHT,
        CM_CARDTYPE.CARD_NINE
    ],
    CARD_TEN_KING: [   // 10 - K 不需要算点数
        CM_CARDTYPE.CARD_TEN,
        CM_CARDTYPE.CARD_JACK,
        CM_CARDTYPE.CARD_QUEEN,
        CM_CARDTYPE.CARD_KING,
    ],
    CARD_FOLLOW: [  // 花色列表
        CM_CARDFOLLOW.CARD_SPADES,
        CM_CARDFOLLOW.CARD_HEARTS,
        CM_CARDFOLLOW.CARD_CLUBS,
        CM_CARDFOLLOW.CARD_DIAMONDS,
    ],
    CARD_ALL: [     // 所以牌列表
        CM_CARDTYPE.CARD_ACE,
        CM_CARDTYPE.CARD_TWO,
        CM_CARDTYPE.CARD_THREE,
        CM_CARDTYPE.CARD_FOUR,
        CM_CARDTYPE.CARD_FIVE,
        CM_CARDTYPE.CARD_SIX,
        CM_CARDTYPE.CARD_SEVEN,
        CM_CARDTYPE.CARD_EIGHT,
        CM_CARDTYPE.CARD_NINE,
        CM_CARDTYPE.CARD_TEN,
        CM_CARDTYPE.CARD_JACK,
        CM_CARDTYPE.CARD_QUEEN,
        CM_CARDTYPE.CARD_KING,
        CM_CARDTYPE.CARD_JOKER
    ]
}


export const MJ_CARD_NAME: any = {};
MJ_CARD_NAME[CM_CARDFOLLOW.CARD_SPADES] = "黑桃";
MJ_CARD_NAME[CM_CARDFOLLOW.CARD_HEARTS] = "红桃";
MJ_CARD_NAME[CM_CARDFOLLOW.CARD_CLUBS] = "梅花";
MJ_CARD_NAME[CM_CARDFOLLOW.CARD_DIAMONDS] = "方块";
MJ_CARD_NAME[CM_CARDFOLLOW.CARD_RED_JOKER] = "大王";
MJ_CARD_NAME[CM_CARDFOLLOW.CARD_BLACK_JOKER] = "小王";

