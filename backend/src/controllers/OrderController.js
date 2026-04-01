const OrderService = require('../services/OrderService');

/**
 * OrderController - HTTP layer for order management.
 * OOP class with bound methods for Express route handlers.
 */
class OrderController {
  constructor() {
    this.orderService = new OrderService();
    this.getAllOrders  = this.getAllOrders.bind(this);
    this.createOrder   = this.createOrder.bind(this);
    this.deleteOrder   = this.deleteOrder.bind(this);
  }

  async getAllOrders(req, res, next) {
    try {
      const orders = await this.orderService.getAllOrders();
      res.json({ orders });
    } catch (err) { next(err); }
  }

  async createOrder(req, res, next) {
    try {
      const { customerName, stockId, orderQty } = req.body;
      const order = await this.orderService.createOrder(customerName, stockId, orderQty);
      res.status(201).json({ message: 'Order created successfully.', order });
    } catch (err) { next(err); }
  }

  async deleteOrder(req, res, next) {
    try {
      await this.orderService.deleteOrder(req.params.id);
      res.json({ message: 'Order deleted successfully.' });
    } catch (err) { next(err); }
  }
}

module.exports = new OrderController();
