import { caleCardPattern } from "../instance_logic/IS_CocklainLogic";
import { CM_PATTERN_NAME, CM_CARDPATTERN } from "../comm_enum/CM_CardPattern";
import { CM_CARDFOLLOW, showCard } from "../comm_enum/CM_CardType";
import _ = require("lodash");




let cardList: number[];
// cardList = [3, 4, 5, 6, 11 | CM_CARDFOLLOW.CARD_HEARTS]
cardList = [
    1 | CM_CARDFOLLOW.CARD_HEARTS,
    1 | CM_CARDFOLLOW.CARD_DIAMONDS,
    4 | CM_CARDFOLLOW.CARD_SPADES,
    8 | CM_CARDFOLLOW.CARD_HEARTS,
    12 | CM_CARDFOLLOW.CARD_CLUBS
]

cardList = [
    2 | CM_CARDFOLLOW.CARD_SPADES,
    3 | CM_CARDFOLLOW.CARD_CLUBS,
    5 | CM_CARDFOLLOW.CARD_DIAMONDS,
    6 | CM_CARDFOLLOW.CARD_DIAMONDS,
    13 | CM_CARDFOLLOW.CARD_CLUBS
]

cardList = [ 35, 66, 22, 42, 34 ]



let cocklainInfo = caleCardPattern(cardList);
console.log(cocklainInfo)
console.log(cardList.map(card => { return showCard(card) }))
console.log(CM_PATTERN_NAME[cocklainInfo.cocklainType]);