
var CocklainStruct = require("../tars/CocklainStructTars").CocklainStruct;

// 玩家基本信息
class UserInfo
{
	constructor(userID = 0)
	{
		this.uiUserID = userID;
		
		this.strNickname = ''; // 昵称
		this.strHeadImgURL = ''; // 头像

		this.iRemainScore = 0; // 剩余分数

		this.uiBolusMutiple = 0; // 推注
	}
};

// 回合数据
class UserRoundData
{
	constructor(userInfo)
	{
		this.userInfo = userInfo;

        this.arrCards = new Array(5);		// 5张牌

		this.bHasSnatchbanker = false; // 已抢庄
		this.uiSnatchbankerMutiple = 0; // 抢庄倍数

		this.bBanker = false; // 庄家

		this.bHasChooseBaseScore = false; // 已叫分
		this.uiBaseScore = 0; // 叫分

		this.uiSellScore = 0; // 卖分
		this.uiSellToChairIdx = 0; // 买家座椅号
        
        this.mapBuyScore = new Map;	// 买分记录

		this.eCardPattern = CocklainStruct.E_CARD_PATTERN.CP_Niu0;

        this.arrNiuCards = new Array(3);	// 3张牛牌

        this.iGainScore = 0; 
	}
};

module.exports = {UserInfo, UserRoundData};
