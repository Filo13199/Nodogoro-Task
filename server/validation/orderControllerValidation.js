const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const createOrderValidation = data => {
    const schema =Joi.object({
        status: Joi.string().valid('pending','paymentProcessing','card declined','paid').default('pending'),
        creationDate: Joi.date().default(Date.now),
        totalPrice: Joi.number().required(),
        address: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        paymentIntentId: Joi.string().required(),
        userName: Joi.string().required(),
        userId: Joi.string().required(),        
    });
    return schema.validate(data);
}

module.exports.createOrderValidation = createOrderValidation;