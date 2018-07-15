/**
 * 一些通用的函数
 * 注意：为了减少数据量序号，不等同于座位号。
 * 1、获取当前执行者序号
 */

/**
* 获取当前玩家的执行顺序
* 返回当前执行顺序
* @param {*} operator 当前优先操作者
* @param {*} playerNum 当前桌玩家人数
*/

export function GetOperatorList(operator: number, playerNum: number) {
    let operatorList: number[] = [];
    let maxIdx: number = operator + playerNum;
    for (let idx: number = operator; idx < maxIdx; idx++) {
        operatorList.push(idx < playerNum ? idx : (idx % playerNum));
    }
    return operatorList;
}