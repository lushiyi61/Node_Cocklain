import { IS_GameData } from "../instance_data/IS_GameData";
import { GM_RoundInfo } from "./GM_RoundInfo";
import { GM_CardInfo } from "./GM_CardInfo";

export class GM_GameData extends IS_GameData {
    constructor(tableType: number, rules: string) {
        super(tableType, rules);
    }
}