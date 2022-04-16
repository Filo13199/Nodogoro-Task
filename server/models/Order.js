const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.Types.ObjectId;
const autoIncrement=require("mongoose-plugin-autoinc");
const OrderSchema = new Schema({
    status :{
        type :String,
        enum : ["pending","paymentProcessing","paymentFailed","paid"],
        default: "pending"
    },
    creationDate : {
        type : Date,
        default:Date.now
    },
    totalPrice : {
        type: Number
    },
    address :{
        type:String,
    },
    phoneNumber:{
        type:String
    },
    transactionId:{
        type:Number
    },
    orderId:{
        type:Number,
    },
   userName:{
        type:String,
    },
    userId:{
        type:String,
        required:true
    },
    number:{
        type:Number
    },
    paymentIntentId:{
        type:String,
        required:true
    }
  });
OrderSchema.plugin(autoIncrement.plugin, { model: 'Order', field: 'number' });
module.exports = Order = mongoose.model('Order', OrderSchema);