const OrderRepository = require('../repositories/OrderRepository');
const StockRepository = require('../repositories/StockRepository');

/**
 * OrderService - Business logic for order management.
 * OOP class injecting both OrderRepository and StockRepository.
 * Manages stock orderQty on order create (increment) and delete (decrement/revert).
 */
class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.stockRepository = new StockRepository();
  }

  async getAllOrders() {
    return this.orderRepository.findAllOrders();
  }

  async createOrder(customerName, stockId, orderQty) {
    if (!customerName || customerName.trim() === '') {
      throw new Error('Customer name is required.');
    }
    if (!stockId) {
      throw new Error('Stock selection is required.');
    }

    const qty = Number(orderQty);
    if (isNaN(qty) || qty <= 0) {
      throw new Error('Order quantity must be a positive number greater than 0.');
    }

    // Fetch stock and validate availability
    const stock = await this.stockRepository.findById(stockId);
    if (!stock) throw new Error('Selected stock not found.');

    const available = stock.stockQty - stock.orderQty;
    if (qty > available) {
      throw new Error(
        `Order quantity (${qty}) exceeds available stock (${available}). ` +
        `Stock "${stock.name}" has ${stock.stockQty} total, ${stock.orderQty} already ordered.`
      );
    }

    // Create order
    const order = await this.orderRepository.createOrder({
      customerName: customerName.trim(),
      stockId: stock._id,
      stockName: stock.name,
      orderQty: qty,
    });

    // Deduct from stock's available qty by incrementing orderQty
    await this.stockRepository.incrementOrderQty(stockId, qty);

    return order;
  }

  async deleteOrder(id) {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new Error('Order not found.');

    // Delete order first
    await this.orderRepository.deleteById(id);

    // Revert: restore the stock's orderQty
    await this.stockRepository.decrementOrderQty(order.stockId, order.orderQty);

    return order;
  }
}

module.exports = OrderService;
