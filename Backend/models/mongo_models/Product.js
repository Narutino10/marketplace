const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        trim: true,
    },
    brand: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        min: 0,
    },
    stock_available: {
        type: Number,
        default: 0,
        min: 0,
    },
    status: {
        type: String,
    },
    images: {
        type: [String],
    }
}, {
    timestamps: false
});

productSchema.statics.getProducts = async function() {
    return this.find();
};

productSchema.statics.getProductById = async function(id) {
    return this.findById(id);
};

productSchema.statics.createProduct = async function(productData) {
    try {
        const newProduct = new this(productData);
        return await newProduct.save();
    } catch (error) {
        throw error;
    }
};

productSchema.statics.updateProduct = async function(id, updates) {
    try {
        return await this.findByIdAndUpdate(id, updates, { new: true });
    } catch (error) {
        throw error;
    }
};

productSchema.statics.deleteProduct = async function(id) {
    try {
        const result = await this.findByIdAndDelete(id);
        return !!result;
    } catch (error) {
        throw error;
    }
};

productSchema.statics.searchProducts = async function(criteria) {
    const query = {};
    if (criteria.name) query.name = new RegExp(criteria.name, 'i');
    if (criteria.category) query.category = criteria.category;
    if (criteria.brand) query.brand = criteria.brand;
    if (criteria.minPrice || criteria.maxPrice) {
        query.price = {};
        if (criteria.minPrice) query.price.$gte = criteria.minPrice;
        if (criteria.maxPrice) query.price.$lte = criteria.maxPrice;
    }
    return this.find(query);
};

productSchema.statics.getProductsByCategory = async function(category) {
    return this.find({ category: category });
};

productSchema.statics.updateProductStock = async function(id, newStock) {
    try {
        return await this.findByIdAndUpdate(id, { stock_available: newStock }, { new: true });
    } catch (error) {
        throw error;
    }
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;