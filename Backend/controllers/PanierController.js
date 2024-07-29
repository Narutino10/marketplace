const Cart = require('../models/postgres_models/Panier');
const Client = require('../models/postgres_models/Userpg');
//const Product = require('../models/postgres_models/ProductPg');
//const Product = require('../models/mongo_models/Product');
const ProductService = require('../services/productService');
//const {authenticateAdmin, authenticateToken} = require('')


const padProductId = (id) => id.toString().padStart(24, '0');
const removeLeftZeros = (str) => str.replace(/^0+/, '');

exports.createCartItem = async (req, res) => {
    try {
        const { userid, productid, quantity } = req.body;

        let client = null;
        if (userid) {
            client = await Client.findByPk(userid);
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
        }

        const paddedProductId = padProductId(productid);
        const product = await ProductService.getProductById(paddedProductId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const quantityNumber = parseInt(quantity, 10);
        if(quantityNumber) {

        }
        if (isNaN(quantityNumber)) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        if (product.stock_available < quantityNumber) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        product.stock_available -= quantityNumber;
        await product.save();

        const reservedUntil = new Date();
        reservedUntil.setMinutes(reservedUntil.getMinutes() + 15);

        const cartItemData = {
            productid: paddedProductId,
            quantity: quantityNumber,
            reservedUntil,
            userid: client ? client.id : userid
        };

        const cartItem = await Cart.create(cartItemData);
        res.status(201).json(cartItem);

        setTimeout(async () => {
            const item = await Cart.findByPk(cartItem.id);
            if (item && new Date() > item.reservedUntil) {
                const productToUpdate = await ProductService.getProductById(item.productid);
                if (productToUpdate) {
                    productToUpdate.stock_available += item.quantity;
                    await productToUpdate.save();
                }
                await item.destroy();
            }
        }, 15 * 60 * 1000);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCartItems = async (req, res) => {
    try {
        const { userid } = req.params;
        const whereClause = { userid };
        const cartItems = await Cart.findAll({ where: whereClause, include: [{ model: Client }] });

        const productIds = cartItems.map(item => padProductId(item.productid));
        const products = await ProductService.getProductsByIds(productIds);

        const cartItemsWithProducts = cartItems.map(cartItem => {
            const product = products.find(p => p._id.toString() === padProductId(cartItem.productid));
            return {
                ...cartItem.toJSON(),
                product,
            };
        });

        res.status(200).json(cartItemsWithProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { userid, productid, quantity } = req.body;

        const cartItem = await Cart.findOne({ where: { userid, productid: padProductId(productid) } });
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        const product = await ProductService.getProductById(padProductId(cartItem.productid));
        const quantityNumber = parseInt(quantity, 10);
        if (isNaN(quantityNumber)) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        const stockDifference = quantityNumber - cartItem.quantity;

        if (product.stock_available < stockDifference) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        product.stock_available -= stockDifference;
        await product.save();

        cartItem.quantity = quantityNumber;
        cartItem.reservedUntil = new Date();
        cartItem.reservedUntil.setMinutes(cartItem.reservedUntil.getMinutes() + 15);
        await cartItem.save();
        res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





exports.deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        //const removeLeftZeros = (str) => str.replace(/^0+/, '');
        //const originalString = "000000000000000000000132";
        const ProductId = removeLeftZeros(id);
        console.log('idproduit',ProductId);

        const cartItem = await Cart.findOne({ where: { productid: ProductId } });
        console.log('idproduitpanier',cartItem);

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        const product = await ProductService.getProductById(padProductId(cartItem.productid));
        if (product) {
            product.stock_available += cartItem.quantity;
            await product.save();
        }

        await cartItem.destroy();
        res.status(204).json({ message: 'Cart item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
