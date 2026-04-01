const BaseRepository = require('./BaseRepository');
const Stock = require('../models/Stock');

/**
 * StockRepository - Data access layer for Stock entities.
 * Extends BaseRepository with stock-specific queries and qty management.
 */
class StockRepository extends BaseRepository {
  constructor() {
    super(Stock);
  }

  // Case-insensitive exact name match (prevents duplicate names)
  async findByName(name) {
    return this.model.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });
  }

  async findAllStocks() {
    return this.model.find().sort({ createdAt: -1 });
  }

  // Increment stock's orderQty when a new order is placed
  async incrementOrderQty(stockId, qty) {
    return this.model.findByIdAndUpdate(
      stockId,
      { $inc: { orderQty: qty } },
      { new: true, runValidators: true }
    );
  }

  // Decrement stock's orderQty when an order is deleted (revert)
  async decrementOrderQty(stockId, qty) {
    return this.model.findByIdAndUpdate(
      stockId,
      { $inc: { orderQty: -qty } },
      { new: true, runValidators: true }
    );
  }
}

module.exports = StockRepository;
