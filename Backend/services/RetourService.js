const Return = require('../models/postgres_models/Returns');
const Order = require('../models/postgres_models/Commande');
const Product = require('../models/postgres_models/ProductPg');
const Client = require('../models/postgres_models/UserPg');

const createReturn = async (returnData) => {
    try {
        const returnRecord = await Return.create(returnData);
        return returnRecord;
    } catch (error) {
        console.error('Error creating return:', error);
        throw new Error('Failed to create return');
    }
};

const getReturnById = async (id) => {
    try {
        const returnRecord = await Return.findByPk(id, {
            include: [Order, Product, Client]
        });
        if (!returnRecord) {
            throw new Error('Return not found');
        }
        return returnRecord;
    } catch (error) {
        console.error('Error fetching return:', error);
        throw new Error('Failed to fetch return');
    }
};

const updateReturnStatus = async (id, status) => {
    try {
        const returnRecord = await Return.findByPk(id);
        if (!returnRecord) {
            throw new Error('Return not found');
        }
        returnRecord.status = status;
        await returnRecord.save();
        return returnRecord;
    } catch (error) {
        console.error('Error updating return status:', error);
        throw new Error('Failed to update return status');
    }
};

const listReturnsByUserId = async (userId) => {
    try {
        const returns = await Return.findAll({
            where: { userId },
            include: [Order, Product]
        });
        return returns;
    } catch (error) {
        console.error('Error fetching returns:', error);
        throw new Error('Failed to fetch returns');
    }
};

module.exports = {
    createReturn,
    getReturnById,
    updateReturnStatus,
    listReturnsByUserId
};
