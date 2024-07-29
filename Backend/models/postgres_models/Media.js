const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');
const Product = require('./ProductPg');

const Media = sequelize.define('Media', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id'
        }
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'Media',
    timestamps: false,
});

Product.hasMany(Media, { foreignKey: 'productId' });
Media.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Media;
