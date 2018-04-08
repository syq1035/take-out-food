const loadpromotions = require('./promotions').promotions();
const loadAllitems = require('./items').allItems();
//统计商品数量
function count(inputs){
  let itemsCount = [];
  for(let item of inputs){
    let arr = item.split(" x ");
    for(let goods of loadAllitems){
      if(arr[0] == goods.id){
        itemsCount.push({id:arr[0] ,name:goods.name ,price:goods.price ,count:arr[1]});        
      }
    }
  }
  //console.log(itemsCount);
  return itemsCount;
}

//计算未优惠前的价格
function countOriginalTotal(itemsCount){
  let originalTotal = 0;
  for(let item of itemsCount){
        originalTotal += item.price*item.count;
  }
  //console.log(originalTotal);
  return originalTotal;
}

//计算半价优惠商品节省的钱
function halfPromotions(itemsCount){
  let halfpricesave = 0;
  let halfPriceItems = loadpromotions[1].items;
  let discountGoods = [];
  for(let item of itemsCount){
    for(let proItem of halfPriceItems){
      if(item.id == proItem){
        discountGoods.push(proItem);
        halfpricesave += item.price/2;
      }
    }
  }
  //console.log(halfpricesave);
  return [halfpricesave,discountGoods];
}

//筛选半价优惠的商品名
function filterDiscountGoods(discountGoodsId){
  let names = [];
  for(let discountGoodsIdItem of discountGoodsId){
    for(let item of loadAllitems){
      if(item.id == discountGoodsIdItem){
        names.push(item.name);
      }
    }
  }
  let nameChar = names.join('，');
  return nameChar;
  
}

//选择优惠最大的方式
function chargePromotions(itemsCount){
  let fullcutSave = 0;
  let promotion;
  let originalTotal = countOriginalTotal(itemsCount);
  if(originalTotal>=30){
    fullcutSave = 6;
  }
  let halfpriceSave = halfPromotions(itemsCount)[0];
  let nameChar = filterDiscountGoods(halfPromotions(itemsCount)[1]);
  if(fullcutSave == halfpriceSave&&fullcutSave==0&&halfpriceSave==0){
    promotion = {type: "无优惠活动" ,save:0};
  }
  else if(fullcutSave >= halfpriceSave){
    promotion = {type: "满30减6元" ,save:fullcutSave};
  }
  else{
    promotion = {type: `指定菜品半价(${nameChar})` ,save:halfpriceSave};
  }
  return promotion;
  //console.log(promotion);
}

//输出
function printInventory(itemsCount,promotion,total){
  let result;
  result = "============= 订餐明细 =============\n";
  for(let item of itemsCount){
    result += item.name+" x "+item.count+" = "+item.price*item.count+"元\n";
  }
  result += "-----------------------------------\n";
  if(promotion.type!="无优惠活动"){
    result += "使用优惠:\n"+promotion.type+"，省"+promotion.save+"元\n";
    result += "-----------------------------------\n";    
  }
  result += "总计："+total+"元\n";
  result += "==================================="
  return result;
}

module.exports = function bestCharge(inputs) {  
  let itemsCount = count(inputs);
  let promotion = chargePromotions(itemsCount);
  let total = countOriginalTotal(itemsCount)-promotion.save;
  let result = printInventory(itemsCount,promotion,total);
  return result;
 }