import { IS_CardInfo } from "../instance_data/IS_CardInfo";







class IS_CardInfoTest extends IS_CardInfo {
    constructor() {
        super()
    }
}


let cardInfo = new IS_CardInfoTest();
cardInfo.InitCardList();
console.log(cardInfo.cardList.length);
console.log(cardInfo.cardList);