import { IS_CardInfo } from "../instance_data/IS_CardInfo";
import { CM_CARDFUNCTION, CM_CARDTYPE, CM_CARDFOLLOW, MJ_CARD_NAME, showCard } from "../comm_enum/CM_CardType";
import _ = require("lodash");







class IS_CardInfoTest extends IS_CardInfo {
    constructor() {
        super()
    }
}


let cardInfo = new IS_CardInfoTest();
console.log(cardInfo.cardList.length);
// console.log(CM_CARDFUNCTION.CARD_FOLLOW);
// console.log(CM_CARDFUNCTION.CARD_ALL);
// console.log(cardInfo.cardList);


CM_CARDFUNCTION.CARD_FOLLOW.map(
    follow => {
        // 获取所有牌
        console.log(follow)
        CM_CARDFUNCTION.CARD_ALL.map(
            card => {
                let newCard = card | follow;
            }
        )
    }
);

const cardList = [26, 43, 75, 58]
console.log(cardList.map(card => { return showCard(card) }))
let tmpCardList: number[];
tmpCardList = _.reverse(cardList)
tmpCardList = _.sortBy(cardList, c => { return c & 0xf })
// tmpCardList = _.sortBy(cardList, c => { return c & 0xf0 })
console.log(tmpCardList.map(card => { return showCard(card) }))



let objects = [
    { 'n': 3, a: 2 },
    { 'n': 1, a: 3 },
    { 'n': 2, a: 4 },
    { 'n': 3, a: 5 },
    { 'n': 3, a: 6 },
    { 'n': 1, a: 7 },
];
let newObjects = _.shuffle(objects);
console.log(_.maxBy(objects, function (o) { return o.n; }))
console.log(_.maxBy(newObjects, function (o) { return o.n; }))