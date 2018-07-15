export const enum CARDTYPE {
    CARD_NUMB = 0x1000,  // 序数牌
    CARD_CHAR = 0x2000,  // 字牌
    CARD_FLOW = 0x3000,  // 花牌
    // const CARD_WILD = 0x4000,  // 百搭牌

    CARD_WILD = 0x0100,  // 癞子掩码(百搭牌)
    CARD_MUSK = 0xFFFF,  // 掩码

    TILE_WAN = 0x0010,  // 万
    TILE_SUO = 0x0020,  // 索
    TILE_BIN = 0x0030,  // 饼
    TILE_WIN = 0x0040,  // 风牌
    TILE_ARR = 0x0050,  // 箭牌
};