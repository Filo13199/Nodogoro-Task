const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.Types.ObjectId;
const autoIncrement=require("mongoose-plugin-autoinc");
const OrderSchema = new Schema({
    status :{
        type :String,
        enum : ["pending","out for delivery","delivered","cancelled","card declined"],
        default: "pending"
    },
    userId : {
        type : ObjectId
    },
    cart:{
        type:Array,
        required:true
    },
    creationDate : {
        type : Date,
        default:Date.now
    },
    totalPrice : {
        type: Number
    },
    totalDiscount : {
        type: Number
    },
    subTotal:{
        type:Number
    },
    paid : {
        type : Boolean,
        default:false
    },
    address :{
        address:String,
        city:ObjectId
    },
    deliveryCharge:{
        type:Number,
    },
    phoneNumber:{
        type:String
    },
    paymentMethod : {
        type: String,
        enum: ["Cash on delivery", "Card on delivery" , "Online"]
    },
    promocodeId:{
        type:ObjectId
    },
    arrivalDate:{
        type:String
    },
    transactionId:{
        type:Number
    },
    verified:{
        type:Boolean,
        default:false
    },
    orderId:{
        type:Number,
    },
    email:{
        type:String,
    },
    userName:{
        type:String,
    },
    number:{
        type:Number
    },
    deleted:{
        type:Boolean,
        default:false
    }


  });
OrderSchema.plugin(autoIncrement.plugin, { model: 'Order', field: 'number' });
module.exports = Order = mongoose.model('Order', OrderSchema);