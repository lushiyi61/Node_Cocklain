export const enum ACTIONTYPE{
    ACTION_NONE       = 0      ,
    ACTION_PLAY       = 1 << 0 ,  // 出牌
    ACTION_PASS       = 1 << 1 ,  // 放弃
    ACTION_CHI_H      = 1 << 2 ,  // 吃头
    ACTION_CHI_M      = 1 << 3 ,  // 吃身
    ACTION_CHI_E      = 1 << 4 ,  // 吃尾
    ACTION_PENG       = 1 << 5 ,  // 碰
    ACTION_GANG_M     = 1 << 6 ,  // 明杠
    ACTION_GANG_A     = 1 << 7 ,  // 暗杠
    ACTION_GANG_B     = 1 << 8 ,  // 补杠
    ACTION_TING       = 1 << 9 ,  // 听
    ACTION_HUED       = 1 << 10 ,  // 胡
    ACTION_BUHUA      = 1 << 11 ,  // 补花
};