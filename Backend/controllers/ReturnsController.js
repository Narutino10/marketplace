const returnService = require('../services/RetourService');

const createReturn = async (req, res, next) => {
    try {
        const returnRecord = await returnService.createReturn(req.body);
        res.status(201).json(returnRecord);
    } catch (error) {
        next(error);
    }
};

const getReturn = async (req, res, next) => {
    try {
        const returnRecord = await returnService.getReturnById(req.params.id);
        res.status(200).json(returnRecord);
    } catch (error) {
        next(error);
    }
};

const updateReturnStatus = async (req, res, next) => {
    try {
        const returnRecord = await returnService.updateReturnStatus(req.params.id, req.body.status);
        res.status(200).json(returnRecord);
    } catch (error) {
        next(error);
    }
};

const listReturnsByUser = async (req, res, next) => {
    try {
        const returns = await returnService.listReturnsByUserId(req.params.userId);
        res.status(200).json(returns);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReturn,
    getReturn,
    updateReturnStatus,
    listReturnsByUser
};
