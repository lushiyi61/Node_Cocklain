
export const enum GAMETYPE {
    GAME_NUM = 0,  // 序数牌
    GAME_WIN = 1 << 1,  // 4*4 东南西北
    GAME_ARR = 1 << 2,  // 3*4 中发白
    GAME_ZHO = 1 << 3,  // 1*4 中
    GAME_FLOW = 1 << 4,  // 8*1 春夏秋冬梅兰竹菊
}
