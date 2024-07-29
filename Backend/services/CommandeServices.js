const Order = require('../models/postgres_models/Commande');
const OrderDetails = require('../models/postgres_models/DetailsCommande');
const User = require('../models/postgres_models/UserPg');
const Product = require('../models/mongo_models/Product');
const sequelize = require('../config/postgres');

const padProductId = (id) => id.toString().padStart(24, '0');
const removeLeftZeros = (str) => str.toString().replace(/^0+/, '');

class OrderService {
    static async createOrder(userId, statusOrder, totalAmount, products) {
        return sequelize.transaction(async (transaction) => {
            const order = await Order.create({
                userId,
                statusOrder,
                totalAmount,
            }, { transaction });

            for (const { productId, quantity } of products) {
                const paddedProductId = padProductId(productId);
                const product = await Product.findById(paddedProductId);
                if (!product) {
                    throw new Error(`Produit avec l'ID ${productId} non trouvé`);
                }

                const newStock = product.stock_available - quantity;
                if (newStock < 0) {
                    throw new Error(`Stock insuffisant pour le produit avec l'ID ${productId}`);
                }

                await Product.findByIdAndUpdate(paddedProductId, { stock_available: newStock }, { new: true });

                await OrderDetails.create({
                    orderId: order.id,
                    productId: paddedProductId,
                    productName: product.name,
                    productDescription: product.description,
                    productCategory: product.category,
                    productBrand: product.brand,
                    unitPrice: product.price,
                    quantity,
                }, { transaction });
            }

            return order.id;
        });
    }

    static async getOrderById(orderId) {
        const order = await Order.findByPk(orderId, {
            include: [
                { model: User },
                { model: OrderDetails }
            ]
        });

        if (order) {
            order.OrderDetails.forEach(detail => {
                detail.productId = padProductId(detail.productId);
            });
        }

        return order;
    }

    static async updateOrder(orderId, updates) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Commande non trouvée');

        Object.assign(order, updates);
        await order.save();
        return order;
    }

    static async deleteOrder(orderId) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Commande non trouvée');

        await order.destroy();
        return order;
    }

    static async addProductToOrder(orderId, productId, quantity) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Commande non trouvée');

        const paddedProductId = padProductId(productId);
        const product = await Product.findById(paddedProductId);
        if (!product) throw new Error('Produit non trouvé');

        await OrderDetails.create({
            orderId: order.id,
            productId: paddedProductId,
            productName: product.name,
            productDescription: product.description,
            productCategory: product.category,
            productBrand: product.brand,
            unitPrice: product.price,
            quantity,
        });

        return order;
    }

    static async removeProductFromOrder(orderId, productId) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Commande non trouvée');

        const paddedProductId = padProductId(productId);
        const orderDetail = await OrderDetails.findOne({ where: { orderId, productId: paddedProductId } });
        if (orderDetail) {
            await orderDetail.destroy();
        }

        return order;
    }

    static async getProductsFromOrder(orderId) {
        const order = await Order.findByPk(orderId, {
            include: { model: OrderDetails }
        });
        if (!order) throw new Error('Commande non trouvée');

        order.OrderDetails.forEach(detail => {
            detail.productId = removeLeftZeros(detail.productId);
        });

        return order.OrderDetails;
    }

    static async getOrders() {
        const orders = await Order.findAll({
            include: { model: OrderDetails }
        });

        orders.forEach(order => {
            order.OrderDetails.forEach(detail => {
                detail.productId = padProductId(detail.productId);
            });
        });

        return orders;
    }

    static async getOrdersByUserId(userId) {
        const orders = await Order.findAll({
            where: { userId },
            include: { model: OrderDetails }
        });

        orders.forEach(order => {
            order.OrderDetails.forEach(detail => {
                detail.productId = padProductId(detail.productId);
            });
        });

        return orders;
    }
}

module.exports = OrderService;
