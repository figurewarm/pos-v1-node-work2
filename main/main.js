    //module.exports = 
    function main(shoppingList) {
        //const datbase = require('../main/datbase')
        var finalBill = '';
        var formatList = formatShoppingList(shoppingList);
        var listWithoutRepeat = shoppingKinds(formatList);
        var countArray = countShoppingNumber(listWithoutRepeat, formatList);
        var discountPrice = countMoney(listWithoutRepeat, countArray)[0];
        var totalPrice = countMoney(listWithoutRepeat, countArray)[1];
        var saveMoney = countMoney(listWithoutRepeat, countArray)[2];
        console.log(countMoney(listWithoutRepeat, countArray))
        finalBill += '***<没钱赚商店>购物清单***\n';
        for (let i = 0; i < listWithoutRepeat.length; i++) {
            finalBill += '名称：' + listWithoutRepeat[i].name + '，数量：' + countArray[i] + listWithoutRepeat[i].unit + '，单价：' +
                listWithoutRepeat[i].price.toFixed(2) + '(元)，小计：' + discountPrice[i].toFixed(2) + '(元)\n'
        }
        finalBill += '----------------------\n' + '挥泪赠送商品：\n';
        //判断是否满足打折条件以及打折情况打印
        for (let i = 0; i < listWithoutRepeat.length; i++) {
            if (judgePromotion(listWithoutRepeat[i].barcode)) {
                let discountNumber = Math.floor(countArray[i] / 3);
                if (discountNumber != 0)
                    finalBill += '名称：' + listWithoutRepeat[i].name + '，数量：' + discountNumber + listWithoutRepeat[i].unit + '\n'
            }
        }
        finalBill += '----------------------\n总计：' + totalPrice.toFixed(2) + '(元)\n节省：' + saveMoney.toFixed(2) + '(元)\n**********************'
        console.log(finalBill);
        return finalBill;
    }

    function countMoney(listWithoutRepeat, countArray) {
        var discountPrice = [];
        var totalPrice = 0;
        var saveMoney = 0;
        for (let i = 0; i < listWithoutRepeat.length; i++) {
            discountPrice[i] = 0;
            if (judgePromotion(listWithoutRepeat[i].barcode)) {
                let discountNumber = Math.floor(countArray[i] / 3);
                discountPrice[i] = listWithoutRepeat[i].price * (countArray[i] - discountNumber);
                totalPrice += discountPrice[i];
                saveMoney += listWithoutRepeat[i].price * discountNumber;
            } else {
                discountPrice[i] = listWithoutRepeat[i].price * countArray[i];
                totalPrice += discountPrice[i]
            }
        }
        return [discountPrice, totalPrice, saveMoney]
    }

    function judgePromotion(barcode) {
        var allPromotions = loadPromotions();
        for (let i = 0; i < allPromotions[0].barcodes.length; i++) {
            if (barcode == allPromotions[0].barcodes[i]) {
                return true;
            }
        }
        return false;
    }

    function formatShoppingList(shoppingList) {
        var formatList = [];
        //const datbase = require('../main/datbase')
        //var allItems = datbase.loadAllItems();
        var allItems = loadAllItems();
        for (let i = 0; i < shoppingList.length; i++) {
            for (let j = 0; j < allItems.length; j++) {
                if (shoppingList[i].length == 10) {
                    if (shoppingList[i] == allItems[j].barcode)
                        formatList.push({
                            barcode: allItems[j].barcode,
                            name: allItems[j].name,
                            unit: allItems[j].unit,
                            price: allItems[j].price
                        })
                } else {
                    if (shoppingList[i].slice(0, 10) == allItems[j].barcode)
                        for (let k = 0; k < shoppingList[i].slice(11); k++)
                            formatList.push({
                                barcode: allItems[j].barcode,
                                name: allItems[j].name,
                                unit: allItems[j].unit,
                                price: allItems[j].price
                            });
                }
            }
        }
        return formatList;
    }

    function shoppingKinds(formatList) {
        var listWithoutRepeat = []
        for (let i = 0; i < formatList.length; i++)
            listWithoutRepeat[i] = formatList[i];
        for (let i = 0; i < listWithoutRepeat.length; i++) {
            for (let j = i + 1; j < listWithoutRepeat.length; j++) {
                if (listWithoutRepeat[i].barcode == listWithoutRepeat[j].barcode) {
                    listWithoutRepeat.splice(j, 1);
                    j--;
                }
            }
        }
        return listWithoutRepeat;
    }

    function countShoppingNumber(listWithoutRepeat, formatList) {
        var countArray = [];
        for (let i = 0; i < listWithoutRepeat.length; i++)
            countArray[i] = 0;
        for (let i = 0; i < listWithoutRepeat.length; i++) {
            for (let j = 0; j < formatList.length; j++)
                if (listWithoutRepeat[i].barcode == formatList[j].barcode)
                    countArray[i]++;
        }
        return countArray
    }