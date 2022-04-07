const CryptoJS =require('crypto-js')
const mongoose=require("mongoose");
const axios=require("axios");
const objectId = require('mongoose').Types.ObjectId;
const Order = require('../models/Order');


exports.initiatePaymentShop =async (req,res)=> {
    var lang=req.headers.language;
    const cart=req.body.cart;
    const promocodeId=req.body.promocodeId;
    const auth_API_Body={"api_key":process.env.API_KEY}
    try{
        const userId=req.user._id;
        const user= req.user;
      if(!user)
        return res.status(400).send({ error: lang === "ar" ? errors.notLoggedIn.ar : errors.notLoggedIn.en });
      if(!cart || cart.length==0)
        return res.status(400).send({ error: lang === "ar" ? errors.emptyCart.ar : errors.emptyCart.en });
      const productIdsWithDups=[...cart].map(el=>{
        return mongoose.Types.ObjectId(el.productId);
      });
      const productIds=[...new Set(productIdsWithDups)]
      const products=await Product.find({'_id': { $in:productIds}});
      const productsIdsOrdered=products.map(el=>el._id.toString());
      const promocode=await Promocode.findById(promocodeId);
      var subtotal=0;
      var discountAmountOnProducts=0;
      for(var i =0;i<cart.length;i++){
        const index=productsIdsOrdered.indexOf(cart[i].productId);
        if(index<0)
          return res.status(400).send({ error: lang === "ar" ? errors.invalidId.ar : errors.invalidId.en });
        const product=products[index];
        if(product.discountPercentage>0 && (new Date(product.discountExpiryDate))>new Date()){
          subtotal +=(Math.round(product.priceWeight[cart[i].weightIndex].price*((100-product.discountPercentage)/100))*cart[i].quantity);
        }
        else  
          subtotal +=(product.priceWeight[cart[i].weightIndex].price*cart[i].quantity);
        
        
        if(promocode&&promocode.products&&(new Date(promocode.expiryDate))>new Date()){
          if(promocode.products.indexOf(cart[i].productId)>=0)
            if(promocode.type=="percentage")
              discountAmountOnProducts+=product.priceWeight[cart[i].weightIndex].price*cart[i].quantity*promocode.percentage/100;
            else if (promocode.type=="amount")
              discountAmountOnProducts+=cart[i].quantity*promocode.amount;
          }
      
        }
      if(promocodeId&&discountAmountOnProducts==0){
        if(!promocode)
          return res.status(400).send({ error: lang === "ar" ? errors.invalidId.ar : errors.invalidId.en });
        if((new Date(promocode.expiryDate))<new Date())
          return res.status(400).send({ error: lang === "ar" ? errors.promoCodeExpired.ar : errors.promoCodeExpired.en });
        if(promocode.minInvoiceTotalPrice&&subtotal<promocode.minInvoiceTotalPrice)
          return res.status(400).send({ error: lang === "ar" ? errors.promoCodeMinimumInvoice.ar : errors.promoCodeMinimumInvoice.en });
        if(promocode.type=="percentage" && (!promocode.products||(promocode.products&&promocode.products.length==0))){
          const priceWithDiscount=subtotal*((100-promocode.percentage)/100);
          const actualDiscount=subtotal*(promocode.percentage/100);
          if(promocode.maxDiscountAmount)
          {
            if(promocode.maxDiscountAmount>actualDiscount)
              subtotal=priceWithDiscount;
            else 
              subtotal-=promocode.maxDiscountAmount;
          }
        }
        else if (promocode.type=="amount"&&(!promocode.products||(promocode.products&&promocode.products.length==0))){
          subtotal-=promocode.amount;
        }
      }
      else if (discountAmountOnProducts>0){
        if(promocode.maxDiscountAmount)
          subtotal-=discountAmountOnProducts>promocode.maxDiscountAmount?promocode.maxDiscountAmount:discountAmountOnProducts;
        else
          subtotal-=discountAmountOnProducts;
      }
      const mobileNumber=req.body.mobileNumber;
      const address=req.body.address
      if(!mobileNumber)
        return res.status(400).send({error:errors.missingRequirements.en})
      if(!objectId.isValid(address.city))
        return res.status(400).send({error:errors.invalidId.en})
      const city=await City.findById(address.city);
      if(!city)
        return res.status(400).send({error:errors.invalidId.en})
      subtotal+=city.deliveryCharge;
      //rounding because paymob doesn't take more than 3 decimal points
      subtotal=Math.round(subtotal);        
      const amount_cents=subtotal*100;
      const auth_API_Response = await axios.post("https://accept.paymob.com/api/auth/tokens",auth_API_Body, {});
      const order_Registration_Body={
        "auth_token": auth_API_Response.data.token,
        "delivery_needed": false,
        "amount_cents": amount_cents,
        "currency": "EGP",
        "items": []
      }
      const order_Registration_Response = await axios.post("https://accept.paymobsolutions.com/api/ecommerce/orders",order_Registration_Body, {  });
      const payment_Key_Request_Body={
        "auth_token": auth_API_Response.data.token,
        "amount_cents": amount_cents, 
        "expiration": 3600, 
        "order_id": order_Registration_Response.data.id,
        "billing_data": {
          "apartment": "NA", 
          "email": user.email, 
          "floor": "NA", 
          "first_name": user.firstName, 
          "street": "NA", 
          "building": "NA", 
          "phone_number": user.mobileNumber?user.mobileNumber:mobileNumber, 
          "shipping_method": "NA", 
          "postal_code": "NA", 
          "city": "NA", 
          "country": "NA", 
          "last_name": user.lastName, 
          "state": "NA"
        }, 
        "currency": "EGP", 
        "integration_id": process.env.PAYMENT_INTEGRATION_ID,
        "lock_order_when_paid": true
      };
      const payment_Key_Request_Response = await axios.post("https://accept.paymobsolutions.com/api/acceptance/payment_keys",payment_Key_Request_Body, {  });
      return res.send({data:payment_Key_Request_Response.data,IframeId:process.env.IFRAME_ID,orderId:order_Registration_Response.data.id})
    }
    catch(err){
      console.log(err.toJson);
      return res.status(400).send({ error:"Something Went Wrong" });
    }
};


exports.confirmHealthNutritionRequest=async function(req,res){
    const lang=req.headers['language'];
    try{
      const orderId=req.params.orderId;
      if(orderId.toString()==="null")
        return res.status(400).send({error:errors.invalidId.en})
      const healthNutritionRequest=await Order.findOne({orderId:orderId});
      if(!healthNutritionRequest)
        return res.status(400).send({ error: lang=="ar"?errors.invalidId.ar:errors.invalidId.en });
      const requestId=healthNutritionRequest._id;
      var conc_string="";
      conc_string+= req.body["amount_cents"];
      conc_string+= req.body["created_at"];
      conc_string+= req.body["currency"];
      conc_string+= req.body["error_occured"];
      conc_string+= req.body["has_parent_transaction"];
      conc_string+= req.body["id"];
      conc_string+= req.body["integration_id"];
      conc_string+= req.body["is_3d_secure"];
      conc_string+= req.body["is_auth"];
      conc_string+= req.body["is_capture"];
      conc_string+= req.body["is_refunded"];
      conc_string+= req.body["is_standalone_payment"];
      conc_string+= req.body["is_voided"];
      conc_string+= req.body["order"];
      conc_string+= req.body["owner"];
      conc_string+=req.body["pending"];
      conc_string+= req.body["source_data"].pan;
      conc_string+= req.body["source_data"].sub_type;
      conc_string+= req.body["source_data"].type;
      conc_string+= req.body["success"];
      if(req.body["success"]!=="true")
        return res.status(400).send({error:errors.paymentError.en});
      const calc_HMAC=CryptoJS.HmacSHA512(conc_string,process.env.HMAC_SECRET);
      const calc_HMAC_HEX= CryptoJS.enc.Hex.stringify(calc_HMAC);
      const recieved_HMAC=req.body.hmac;
      if(calc_HMAC_HEX!==recieved_HMAC){
        await Order.findByIdAndUpdate(requestId,{paid:false,status:"card declined"})
        return res.status(400).send({ error: lang=="ar"?errors.paymentError.ar:errors.paymentError.en });
      }
      const updatedHealthNutritionRequest=await Order.findByIdAndUpdate(requestId,{paid:true,transactionId:req.body.id});
      requestNotification("shop",updatedOrder.number);
      return res.send({data:updatedHealthNutritionRequest});
    }
    catch(err){
      console.log(err);
      return res.status(400).send({ error: lang=="ar"?errors.somethingWentWrong.ar:errors.somethingWentWrong.en });
  
    }
};

exports.shopTransactionProcessed =async(req,res)=>{
  const lang=req.headers['language'];
  try{

    if(req.body.type=="TOKEN"){
      //console.log(req.body);
      const orderRequest=await Order.findOne({orderId:req.body.obj.order_id});
      const userInQuestion=await User.findById(orderRequest.userId);
      var userCards=[...userInQuestion.savedCards];
      if(userCards)
      {
        var index=-1;
        for(var i=0;i<userCards.length;i++){
          if(userCards[i].masked_pan==req.body.obj.masked_pan){
            userCards[i].token=req.body.obj.token;
            index=i;
          }
        }
        if(index===-1)
          userCards.push({id:req.body.obj.id,token:req.body.obj.token,masked_pan:req.body.obj.masked_pan,card_subtype:req.body.obj.card_subtype,created_at:new Date(req.body.obj.created_at.toString())})
      }
      await User.findByIdAndUpdate(orderRequest.userId,{savedCards:userCards});
   }
   else{
    const orderRequest=await Order.findOne({orderId:req.body.obj.order_id});
    var conc_string="";
      conc_string+= req.body.obj["amount_cents"];
      conc_string+= req.body.obj["created_at"];
      conc_string+= req.body.obj["currency"];
      conc_string+= req.body.obj["error_occured"];
      conc_string+= req.body.obj["has_parent_transaction"];
      conc_string+= req.body.obj["id"];
      conc_string+= req.body.obj["integration_id"];
      conc_string+= req.body.obj["is_3d_secure"];
      conc_string+= req.body.obj["is_auth"];
      conc_string+= req.body.obj["is_capture"];
      conc_string+= req.body.obj["is_refunded"];
      conc_string+= req.body.obj["is_standalone_payment"];
      conc_string+= req.body.obj["is_voided"];
      conc_string+= req.body.obj["order"].id;
      conc_string+= req.body.obj["owner"];
      conc_string+=req.body.obj["pending"];
      conc_string+= req.body.obj["source_data"].pan;
      conc_string+= req.body.obj["source_data"].sub_type;
      conc_string+= req.body.obj["source_data"].type;
      conc_string+= req.body.obj["success"];
      const calc_HMAC=CryptoJS.HmacSHA512(conc_string,process.env.HMAC_SECRET);
      const calc_HMAC_HEX= CryptoJS.enc.Hex.stringify(calc_HMAC);
      const recieved_HMAC=req.query.hmac;
      if(req.body.obj["success"]!=="true")
      {
        //set request to not paid
        await Order.findByIdAndUpdate(orderRequest._id,{status:"card declined",paid:false})
      }
      if(recieved_HMAC!==calc_HMAC_HEX){
        await Order.findByIdAndUpdate(orderRequest._id,{status:"card declined",paid:false})
      }
      else if(recieved_HMAC==calc_HMAC_HEX){
        await Order.findByIdAndUpdate(orderRequest._id,{status:"pending",paid:true});
      }
   }
   return res.send({data:"Order Processed"})

  }
  catch(err){
    console.log(err);
    return res.status(400).send({ error:"Something Went Wrong" });

  }
 
};

exports.paySavedCardShop=async(req,res)=>{
try{
  if(!objectId.isValid(req.params.cardId)||!req.body.payment_token)
    return res.status(400).send({ error: "Missing Card id" });
  var card;
  const user=await User.findById(req.user._id);
  for(var i=0;i<user.savedCards.length;i++){
    if(user.savedCards[i]._id==req.params.cardId){
      card=user.savedCards[i];
      break;
    }
  }
  if(!card)
    return res.status(400).send({ error: "Missing Card id" });

  const pay_using_token_Body=
  {
    "source":{
                "identifier":card.token,
                "subtype":"TOKEN"                
              },
    "payment_token":req.body.payment_token
  }
  const order_Registration_Response = await axios.post("https://accept.paymob.com/api/acceptance/payments/pay",pay_using_token_Body, {  });
  return res.send({data:order_Registration_Response.data});
}
catch(err){
  console.log(err);
  return res.status(400).send({ error:"Something Went Wrong" });
}
};

