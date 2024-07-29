const paymentService = require('../services/paymentService');

const createPayment = async (req, res, next) => {
    try {
        const payment = await paymentService.createPayment(req.body);
        res.status(201).json(payment);
    } catch (error) {
        next(error);
    }
};

const getPayment = async (req, res, next) => {
    try {
        const payment = await paymentService.getPaymentById(req.params.id);
        res.status(200).json(payment);
    } catch (error) {
        next(error);
    }
};

const updatePaymentStatus = async (req, res, next) => {
    try {
        const payment = await paymentService.updatePaymentStatus(req.params.id, req.body.status);
        res.status(200).json(payment);
    } catch (error) {
        next(error);
    }
};

const listPaymentsByUser = async (req, res, next) => {
    try {
        const payments = await paymentService.listPaymentsByUserId(req.params.userId);
        res.status(200).json(payments);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPayment,
    getPayment,
    updatePaymentStatus,
    listPaymentsByUser
};
