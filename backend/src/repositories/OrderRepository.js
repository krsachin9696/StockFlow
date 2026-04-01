const BaseRepository = require('./BaseRepository');
const Order = require('../models/Order');

/**
 * OrderRepository - Data access layer for Order entities.
 * Extends BaseRepository with order-specific queries.
 */
class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  async findAllOrders() {
    return this.model
      .find()
      .populate('stockId', 'name stockQty orderQty')
      .sort({ createdAt: -1 });
  }

  async findByStockId(stockId) {
    return this.model.find({ stockId });
  }

  async createOrder(data) {
    const order = new this.model(data);
    return order.save();
  }
}

module.exports = OrderRepository;
