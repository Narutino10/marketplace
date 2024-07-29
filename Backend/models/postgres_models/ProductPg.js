const { DataTypes } = require('sequelize');
//const Section = require('./Menu');
const sequelize = require('../../config/postgres');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    stock_available: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: true,
    }/*,
    sectionId: {
        type: DataTypes.INTEGER,
        references: {
            model: Section,
            key: 'id'
        },
        allowNull: false,
    }*/
}, {
    tableName: 'Product',
    timestamps: false,
});

//Section.hasMany(Product, { foreignKey: 'sectionId' });
//Product.belongsTo(Section, { foreignKey: 'sectionId' });

// Méthodes statiques
Product.getProducts = async () => {
    return Product.findAll();
};

Product.getProductById = async (id) => {
    return Product.findByPk(id);
};

Product.createProduct = async (productData) => {
    try {
        const newProduct = await Product.create(productData);
        return newProduct;
    } catch (error) {
        throw error;
    }
};

Product.updateProduct = async (id, updates) => {
    try {
        const [updatedRowsCount, updatedProducts] = await Product.update(updates, {
            where: { id: id },
            returning: true,
        });
        return updatedProducts[0];
    } catch (error) {
        throw error;
    }
};

Product.deleteProduct = async (id) => {
    try {
        const deletedRowCount = await Product.destroy({
            where: { id: id },
        });
        return deletedRowCount > 0;
    } catch (error) {
        throw error;
    }
};

Product.searchProducts = async (criteria) => {
    const whereClause = {};
    if (criteria.name) whereClause.name = { [Op.iLike]: `%${criteria.name}%` };
    if (criteria.category) whereClause.category = criteria.category;
    if (criteria.brand) whereClause.brand = criteria.brand;
    if (criteria.minPrice) whereClause.price = { ...whereClause.price, [Op.gte]: criteria.minPrice };
    if (criteria.maxPrice) whereClause.price = { ...whereClause.price, [Op.lte]: criteria.maxPrice };

    return Product.findAll({ where: whereClause });
};

Product.getProductsByCategory = async (category) => {
    return Product.findAll({
        where: { category: category },
    });
};

Product.updateProductStock = async (id, newStock) => {
    try {
        const [updatedRowsCount, updatedProducts] = await Product.update(
            { stock_available: newStock },
            {
                where: { id: id },
                returning: true,
            }
        );
        return updatedProducts[0];
    } catch (error) {
        throw error;
    }
};

module.exports = Product;