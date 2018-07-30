import { IS_CardInfo } from "../instance_data/IS_CardInfo";

/**
 * 牌数据类
 * ==================
 */
export class GM_CardInfo extends IS_CardInfo {
    dealer: number;         // 庄家座位号
    cardList: number[];     // 剩余牌墙列表

    constructor() {
        super();
    }
};
