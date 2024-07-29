function errorHandler(err, res, res, next){
    console.error(err.stack);
    res.status(500).send(err.message)
}

module.exports = errorHandler;