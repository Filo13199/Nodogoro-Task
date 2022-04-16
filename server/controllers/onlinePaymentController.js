const CryptoJS =require('crypto-js')
const mongoose=require("mongoose");
const axios=require("axios");
const objectId = require('mongoose').Types.ObjectId;
const Order = require('../models/Order');


exports.getPaymentToken =async function(req,res){
    var lang=req.headers.language;
    const auth_API_Body={"api_key":process.env.API_KEY}
    try{
      const mobileNumber=req.body.phoneNumber;
      const firstName=req.body.firstName;
      const lastName=req.body.lastName;
      const email=req.body.email;
      const amount=req.body.amount;
      if(!mobileNumber || !firstName || !lastName || !email)
        return res.status(400).send({error:"Missing Some Requirements"})
      const user={
        mobileNumber:mobileNumber,
        firstName:firstName,
        lastName:lastName,
        email:email
      }
      var subtotal=1000;
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
      console.log(payment_Key_Request_Response.data);
      return res.send({data:payment_Key_Request_Response.data,IframeId:process.env.IFRAME_ID,orderId:order_Registration_Response.data.id})
    }
    catch(err){
      console.log(err.toString());
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


//WEBHOOKS
exports.orderTransactionProcessed =async(req,res)=>{
  const lang=req.headers['language'];
  try{
    console.log(req.body);
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
        await Order.findByIdAndUpdate(orderRequest._id,{status:"paid"});
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

