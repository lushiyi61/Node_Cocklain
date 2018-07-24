
var gameConf = require("../game_data/gameConf.js");

var {UserInfo, UserRoundData} = require("../game_data/UserInfo.js");

// 结算类
function caleResult(arrUserRoundData, roomRules) // 结算入口
{
	// 找到庄家
	let bankerUserRoundData = null;
	for (let userRoundData of arrUserRoundData)
	{
		if (userRoundData.bBanker)
		{
            bankerUserRoundData = userRoundData;
            break;
		}
	}
	if (null == bankerUserRoundData)
	{
		return false;
    }
    
    bankerUserRoundData.userInfo.uiBolusMutiple = 0;

    // 庄闲比牌
    for (let userRoundData of arrUserRoundData)
	{
		if (userRoundData == bankerUserRoundData)
		{
			continue;
		}

		compareWithBanker(bankerUserRoundData, userRoundData, roomRules);
	}

	// 买卖分结算
	return caleSellBuyScore(arrUserRoundData);
}

function compareWithBanker(bankerRoundData, userRoundData, roomRules) // 庄闲比牌结算
{
	let eWinCardPattern = CocklainStruct.E_CARD_PATTERN.CP_Niu0;
	let bBankerWin = compareUserCards(bankerRoundData, userRoundData);
	if (bBankerWin)
	{
		eWinCardPattern = bankerRoundData.eCardPattern;
	}
	else
	{
		eWinCardPattern = userRoundData.eCardPattern;
	}

	// 赔率
	let uOdds = gameConf.mapOdds.get(eWinCardPattern);

	let uiSnatchbankerMutiple = bankerRoundData.uiSnatchbankerMutiple;

	let uiUserBaseScore = userRoundData.uiBaseScore;

	let uScore = uOdds * uiSnatchbankerMutiple * uiUserBaseScore;

    let uiBolusMutiple = 0;
	if (bBankerWin)
	{
		bankerRoundData.iGainScore += uScore;
		bankerRoundData.userInfo.iRemainScore += uScore;

		userRoundData.iGainScore -= uScore;
		userRoundData.userInfo.iRemainScore -= uScore;
	}
	else
	{
		bankerRoundData.iGainScore -= uScore;
		bankerRoundData.userInfo.iRemainScore -= uScore;

		userRoundData.iGainScore += uScore;
		userRoundData.userInfo.iRemainScore += uScore;

		if (0 == userRoundData.userInfo.uiBolusMutiple) // 本局未推注下局可推注
		{
			uiBolusMutiple = roomRules.uiBaseScore2 + uScore;
			if (uiBolusMutiple > roomRules.uiMaxBolusMultiple)
			{
				uiBolusMutiple = roomRules.uiMaxBolusMultiple;
			}
        }
	}
    userRoundData.userInfo.uiBolusMutiple = uiBolusMutiple;
}

function compareUserCards(userRoundData1, userRoundData2) // 比较玩家手上的牌
{
	if (userRoundData1.eCardPattern > userRoundData2.eCardPattern)
	{
		return true;
	}

	if (userRoundData1.eCardPattern < userRoundData2.eCardPattern)
	{
		return false;
	}

	let uMaxCard1 = userRoundData1.arrCards.reduce((prev,cur)=>cur>prev?cur:prev);

	let uMaxCard2 = userRoundData2.arrCards.reduce((prev,cur)=>cur>prev?cur:prev);

	return uMaxCard1 > uMaxCard2;
}

function caleSellBuyScore(arrUserRoundData) // 买卖分结算
{
	for (let userRoundData of arrUserRoundData)
	{
		if (userRoundData.bBanker)
		{
			continue;
		}

		for (let [sellChairIdx, uScore] of userRoundData.mapBuyScore)
		{
			let sellUserRoundData = arrUserRoundData[sellChairIdx];
			if (sellUserRoundData == undefined)
			{
				return false;
			}

			if (compareUserCards(userRoundData, sellUserRoundData))
			{
				userRoundData.iGainScore += uScore;
				userRoundData.userInfo.iRemainScore += uScore;

				sellUserRoundData.iGainScore -= uScore;
				sellUserRoundData.userInfo.iRemainScore -= uScore;
			}
			else
			{
				userRoundData.iGainScore -= uScore;
				userRoundData.userInfo.iRemainScore -= uScore;

				sellUserRoundData.iGainScore += uScore;
				sellUserRoundData.userInfo.iRemainScore += uScore;
			}
		}
	}

	return true;
}

module.exports.caleResult = caleResult;
