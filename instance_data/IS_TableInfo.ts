


export class IS_TableInfo {
    type: number;           // 桌子类型
    roundCurr: number = 0;  // 当前局数
    roundMax: number = 1;   // 总局数
    mapUserInfo: Map<number, IS_TableUserInfo> = new Map();        // 玩家总成绩
    listWinUser: number[] = [];                                    // 胜利玩家列表

    constructor(type: number) {
        this.type = type;
    }

    UpdateUserInfo(listUser: number[]) {
        listUser.map(user => {
            if (!this.mapUserInfo.has(user)) {
                this.mapUserInfo.set(user, new IS_TableUserInfo());
            }
        })
    }

    UpdateRound() {
        this.roundCurr += 1;
    }
}



class IS_TableUserInfo {

}