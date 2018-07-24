
function genCard(uNum, uType)
{
	return uNum * 10 + uType;
}

function getCardNum(uCard) // 牌点数
{
	return uCard / 10;
}

function getCardType(uCard) // 牌花色
{
	return uCard % 10;
}

function getCardValue(uCard) // 牌点数
{
	let uNum = getCardNum(uCard);
	if (10 <= uNum)
	{
		return 0;
	}
	else
	{
		return uNum;
	}
}


class CardMgr
{
    constructor()
    {
        this.arrCards = [];
    }
     
    // 洗牌、52张
    washCard()
    {
        for (let num = 1; num <= 13; num++)
        {
            for (let type = 1; type <= 4; type++)
            {
                this.arrCards.push(genCard(num, type));
            }
        }

        // 打乱
        let uBound = this.arrCards.length-1;
        for (let uIndex = 0; uIndex <= uBound - 1; uIndex++)
        {
            let uRandIndex = uIndex + 1 + (Math.round(Math.random()*100)%(uBound - uIndex));
            
            let temp = this.arrCards[uIndex];
            this.arrCards[uIndex] = this.arrCards[uRandIndex];
            this.arrCards[uRandIndex] = temp;
        }
    }
    
    fetchCard(uCount) // 发牌
    {
        return this.arrCards.splice(0, 4);
    }

    caleCardPattern(arrCards, arrNiuCards) // 计算牌型
    {
        // 检查JQK(五花牛)
        if (checkJQK(arrCards))
        {
            return CocklainStruct.E_CARD_PATTERN.CP_5HuaNiu; // 五花牛
        }
    
        // 检查五小牛
        if (check5XiaoNiu(arrCards))
        {
            return CocklainStruct.E_CARD_PATTERN.CP_5XiaoNiu;
        }
    
        // 检查同花色
        let bTonghua = checkTonghua(arrCards);
    
        // 检查顺子
        let bShunzi = checkShunzi(arrCards);
    
        if (bTonghua && bShunzi)
        {
            return CocklainStruct.E_CARD_PATTERN.CP_Tonghuashun;
        }
    
        let mapCardCount = new Map;
        for (let uIndex = 0; uIndex < arrCards.size(); uIndex++)
        {
            let uNum = getCardNum(arrCards[uIndex]);
            mapCardCount[uNum]++;
        }
    
        // 检查炸弹
        if (checkZhadan(mapCardCount))
        {
            return CocklainStruct.E_CARD_PATTERN.CP_Zhadan;
        }
    
        // 检查银牛
        if (checkYinNiu(arrCards))
        {
            return CocklainStruct.E_CARD_PATTERN.CP_YinNiu;
        }
    
        if (bTonghua)
        {
            return CocklainStruct.E_CARD_PATTERN.CP_Tonghua; // 同花牛
        }
    
        if (bShunzi)
        {
            return CocklainStruct.E_CARD_PATTERN.CP_Shunzi; // 顺子牛
        }
    
        // 检查葫芦牛
        if (checkHulu(mapCardCount))
        {
            return CocklainStruct.E_CARD_PATTERN.CP_Hulu;
        }
    
        return caleNiu(arrCards, arrNiuCards);
    }

    // 检查JQK(五花牛)
    checkJQK(arrCards)
    {
        return vecCards.every(function(cardValue){
            let uNum = getCardNum(cardValue);
            if (__J != uNum && __Q != uNum && __K != uNum)
            {
                return false;
            }
            return true;
        });
    }

    // 检查五小牛
    check5XiaoNiu(arrCards)
    {
        let uSum = 0;
        for (let cardValue of arrCards)
        {
            let uNum = getCardNum(cardValue);
            if (5 <= uNum)
            {
                return false;
            }

            uSum += uNum;
        }

        if (10 < uSum)
        {
            return false;
        }

        return true;
    }

    // 检查顺子
    checkShunzi(arrCards)
    {
        let vecSortedCards = [...arrCards];
        vecSortedCards.sort((cardValue1,cardValue2)=>cardValue1<cardValue2);

        for (let uIndex = 1; uIndex < vecSortedCards.length; uIndex++)
        {
            if (1 != getCardNum(vecSortedCards[uIndex]) - getCardNum(vecSortedCards[uIndex - 1]))
            {
                return false;
            }
        }

        return true;
    }

    // 检查同花色
    checkTonghua(arrCards)
    {
        for (let uIndex = 1; uIndex < vecCards.size(); uIndex++)
        {
            if (getCardType(vecCards[uIndex]) != getCardType(vecCards[uIndex - 1]))
            {
                return false;
            }
        }

        return true;
    }

    // 检查炸弹
    checkZhadan(mapCardCount)
    {
        return mapCardCount.values().some(cardCount=>cardCount==4);
    }

    // 检查银牛
    checkYinNiu(arrCards)
    {
        let uCount = 0;
        for (let cardValue of arrCards)
        {
            let uNum = getCardNum(cardValue);
            if (__J == uNum || __Q == uNum || __K == uNum)
            {
                uCount++;
            }
            else if (10 != uNum)
            {
                return false;
            }
        }

        return (4 == uCount);
    }

    // 检查葫芦牛
    checkHulu(mapCardCount)
    {
        if (2 != mapCardCount.size())
        {
            return false;
        }

        return mapCardCount.values().every(cardCount=>2 == cardCount || 3 == cardCount);
    }

    caleNiu(arrCards, arrNiuCards)
    {
        let cardSetEnum = enum3card(vecCards);
    
        for (let cardSet of cardSetEnum)
        {
            let uSum3Card = 0;
            for (let cardValue of cardSet)
            {
                uSum3Card += getCardValue(cardValue);
            }
    
            if (0 == uSum3Card % 10)
            {
                arrNiuCards.push(...cardSet);
                
                let uSumElse = 0;
                for (let cardValue of arrCards)
                {
                    if (!cardSet.includes(cardValue))
                    {
                        uSumElse += getCardValue(cardValue);
                    }
                }
                uSumElse = uSumElse % 10;
                if (0 == uSumElse)
                {
                    return CocklainStruct.E_CARD_PATTERN.CP_Niuniu; // 牛牛
                }
                else
                {
                    return CocklainStruct.E_CARD_PATTERN.CP_Niu0 + uSumElse; // 牛几
                }
            }
        }
    
        return CocklainStruct.E_CARD_PATTERN.CP_Niu0; // 无牛
    }
    
    // 枚举5张牌的任意3张组合
    enum3card(arrCards)
    {
        let cardSetEnum = [];

        let arrTemp = [0,0,0];
        for (let uIndex0 = 0; uIndex0 < vecCards.size(); uIndex0++)
        {
            let card0 = vecCards[uIndex0];
            arrTemp[0] = card0;

            for (let uIndex1 = 0; uIndex1 < vecCards.size(); uIndex1++)
            {
                let card1 = vecCards[uIndex1];
                if (card1 == card0)
                {
                    continue;
                }

                arrTemp[1] = card1;

                for (let uIndex2 = 0; uIndex2 < vecCards.size(); uIndex2++)
                {
                    let card2 = vecCards[uIndex2];
                    if (card2 != card0 && card2 != card1)
                    {
                        arrTemp[2] = card2;

                        cardSetEnum.push([...arrTemp]);
                    }
                }
            }
        }

        return cardSetEnum;
    }
}
