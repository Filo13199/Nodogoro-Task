const CryptoJS = require('crypto-js')
const mongoose = require("mongoose");
const axios = require("axios");
const { createOrderValidation } = require("../validation/orderControllerValidation")
const Order = require("../models/Order");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
exports.createOrder = async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.totalPrice * 100,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
        });
        req.body.paymentIntentId = paymentIntent.id;
        const { error } = createOrderValidation(req.body);

        if (error)
            return res.status(400).send({ error: error.details[0].message });
        const createdOrder = await Order.create(req.body);

        return res.send({ data: createdOrder, clientSecret: paymentIntent.client_secret });
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).send({ error: err.message });
    }
}
exports.getUsersOrders = async (req, res) => {
    try {
        var status = req.query.status;
        var pageNum = req.params.page;
        var itemsPerPage = req.params.pageSize;
        const sub = req.params.sub;
        if (!pageNum || !itemsPerPage || !sub)
            return res.status(400).send({ error: "Missing Some Requirements" });
        pageNum = parseInt(pageNum);
        itemsPerPage = parseInt(itemsPerPage);
        var matchFilters = [];
        var searchFilters;
        if (status) {
            searchFilters = { status: { $eq: status } };
            matchFilters.push(searchFilters);
        }
        matchFilters.push({ userId: { $eq: sub } });
        var aggregateFilters = [{ $match: { $and: matchFilters } }];
        var response = {};
        const countQuery = await Order.aggregate([...aggregateFilters, { $count: "count" }]);
        if (countQuery.length == 0)
            response.size = 0;
        else
            response.size = countQuery[0].count;
        aggregateFilters.push(
            { $skip: (itemsPerPage * pageNum) },
            { $limit: itemsPerPage }
        );

        const filteredOrders = await Order.aggregate(aggregateFilters);

        response.data = filteredOrders;

        return res.send(response);
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).send({ error: err.message });
    }
}
exports.deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const sub = req.params.sub;
        var pageSize = req.params.pageSize;
        var pageNum = req.params.page;
        var status = req.query.status;
        const order = await Order.findById(orderId);
        if (!order ||(order && (order.userId!=sub)))
            return res.status(400).send({ error: "Order Not Found" });
        if (order.status != "pending")
            return res.status(400).send({ error: "Order Already Placed" });
        await Order.findByIdAndDelete(orderId);
        pageNum = parseInt(pageNum);
        pageSize = parseInt(pageSize);
        var matchFilters = [];
        var searchFilters;
        if (status) {
            searchFilters = { status: { $eq: status } };
            matchFilters.push(searchFilters);
        }
        matchFilters.push({ userId: { $eq: sub } });
        var aggregateFilters = [{ $match: { $and: matchFilters } }];
        var response = {};
        const countQuery = await Order.aggregate([...aggregateFilters, { $count: "count" }]);
        if (countQuery.length == 0)
            response.size = 0;
        else
            response.size = countQuery[0].count;
        aggregateFilters.push(
            { $skip: (pageSize * pageNum) },
            { $limit: pageSize }
        );

        const filteredOrders = await Order.aggregate(aggregateFilters);
        return res.send({data:filteredOrders ,message: "Order Deleted" });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ error: err.message });
    }
}