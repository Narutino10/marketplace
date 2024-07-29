const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');

class Payment extends Model {}

Payment.init({
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Orders',
            key: 'id'
        },
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Clients',
            key: 'id'
        },
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transactionId: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'Payment',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Payment;
