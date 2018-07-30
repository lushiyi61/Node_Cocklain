


export class IS_TableInfo {
    type: number;       // 桌子类型
    currRound: number = 0;
    mapUserInfo: Map<number, IS_TableUserInfo> = new Map();        // 玩家总成绩
    listWinUser: number[] = [];                                    // 胜利玩家列表

    constructor(type: number) {
        this.type = type;
    }


    UpdateRound() {
        this.currRound += 1;
    }
}



class IS_TableUserInfo {

}