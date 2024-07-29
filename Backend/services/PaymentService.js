const Payment = require('../models/postgres_models/Payments');
const Order = require('../models/postgres_models/Commande');
const Client = require('../models/postgres_models/UserPg');

const createPayment = async (paymentData) => {
    try {
        const payment = await Payment.create(paymentData);
        return payment;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw new Error('Failed to create payment');
    }
};

const getPaymentById = async (id) => {
    try {
        const payment = await Payment.findByPk(id, {
            include: [Order, Client]
        });
        if (!payment) {
            throw new Error('Payment not found');
        }
        return payment;
    } catch (error) {
        console.error('Error fetching payment:', error);
        throw new Error('Failed to fetch payment');
    }
};

const updatePaymentStatus = async (id, status) => {
    try {
        const payment = await Payment.findByPk(id);
        if (!payment) {
            throw new Error('Payment not found');
        }
        payment.status = status;
        await payment.save();
        return payment;
    } catch (error) {
        console.error('Error updating payment status:', error);
        throw new Error('Failed to update payment status');
    }
};

const listPaymentsByUserId = async (userId) => {
    try {
        const payments = await Payment.findAll({
            where: { userId },
            include: [Order]
        });
        return payments;
    } catch (error) {
        console.error('Error fetching payments:', error);
        throw new Error('Failed to fetch payments');
    }
};

module.exports = {
    createPayment,
    getPaymentById,
    updatePaymentStatus,
    listPaymentsByUserId
};
