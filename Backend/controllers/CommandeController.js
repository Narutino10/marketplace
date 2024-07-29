const OrderService = require('../services/CommandeServices');
const Cart = require('../models/postgres_models/Panier');
const ProductService = require('../services/productService');

exports.createOrder = async (req, res, next) => {
    try {
        const { userId, statusOrder, totalAmount, products } = req.body;

        // Créer la commande
        const orderId = await OrderService.createOrder(userId, statusOrder, totalAmount, products);

        // Vider les articles du panier pour l'utilisateur
        await Cart.destroy({ where: { userid: userId } });

        res.status(201).json(orderId);
    } catch (error) {
        next(error);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await OrderService.getOrderById(orderId);
        if (!order) return res.status(404).json({ message: 'Commande non trouvée' });

        const detailedProducts = await Promise.all(order.OrderDetails.map(async product => {
            const productDetails = await ProductService.getProductById(product.productId);
            return {
                ...product.toJSON(),
                ...productDetails
            };
        }));

        res.status(200).json({ ...order.toJSON(), products: detailedProducts });
    } catch (error) {
        next(error);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await OrderService.getOrders();

        const detailedOrders = await Promise.all(orders.map(async order => {
            const detailedProducts = await Promise.all(order.OrderDetails.map(async product => {
                const productDetails = await ProductService.getProductById(product.productId);
                return {
                    productName: product.productName,
                    unitPrice: product.unitPrice,
                    quantity: product.quantity,
                };
            }));
            return { ...order.toJSON(), OrderDetails: detailedProducts };
        }));

        res.status(200).json(detailedOrders);
    } catch (error) {
        next(error);
    }
};


exports.updateOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const updates = req.body;
        const order = await OrderService.updateOrder(orderId, updates);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        await OrderService.deleteOrder(orderId);
        res.status(204).json({ message: 'Commande supprimée' });
    } catch (error) {
        next(error);
    }
};

exports.addProductToOrder = async (req, res, next) => {
    try {
        const { orderId, productId } = req.params;
        const { quantity } = req.body;
        const order = await OrderService.addProductToOrder(orderId, productId, quantity);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

exports.removeProductFromOrder = async (req, res, next) => {
    try {
        const { orderId, productId } = req.params;
        const order = await OrderService.removeProductFromOrder(orderId, productId);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

exports.getProductsFromOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const products = await OrderService.getProductsFromOrder(orderId);

        const detailedProducts = await Promise.all(products.map(async product => {
            const productDetails = await ProductService.getProductById(product.productId);
            return {
                ...product.toJSON(),
                ...productDetails
            };
        }));

        res.status(200).json(detailedProducts);
    } catch (error) {
        next(error);
    }
};

exports.getOrdersByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const orders = await OrderService.getOrdersByUserId(userId);

        const detailedOrders = await Promise.all(orders.map(async order => {
            const detailedProducts = await Promise.all(order.OrderDetails.map(async product => {
                const productDetails = await ProductService.getProductById(product.productId);
                return {
                    productName: product.productName,
                    unitPrice: product.unitPrice,
                    quantity: product.quantity,
                };
            }));
            return { ...order.toJSON(), OrderDetails: detailedProducts };
        }));

        res.status(200).json(detailedOrders);
    } catch (error) {
        next(error);
    }
};

