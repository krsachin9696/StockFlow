const StockRepository = require('../repositories/StockRepository');

/**
 * StockService - Business logic for stock management.
 * OOP class injecting StockRepository.
 * Enforces: unique name, qty > 0, delete protection when orderQty > 0.
 */
class StockService {
  constructor() {
    this.stockRepository = new StockRepository();
  }

  async getAllStocks() {
    return this.stockRepository.findAllStocks();
  }

  async getStockById(id) {
    const stock = await this.stockRepository.findById(id);
    if (!stock) throw new Error('Stock not found.');
    return stock;
  }

  async createStock(name, stockQty) {
    if (!name || name.trim() === '') {
      throw new Error('Stock name is required.');
    }

    const qty = Number(stockQty);
    if (isNaN(qty) || qty <= 0) {
      throw new Error('Stock quantity must be a positive number greater than 0.');
    }

    // Duplicate name check (case-insensitive)
    const existing = await this.stockRepository.findByName(name.trim());
    if (existing) {
      throw new Error(`A stock named "${name.trim()}" already exists.`);
    }

    return this.stockRepository.create({
      name: name.trim(),
      stockQty: qty,
      orderQty: 0,
    });
  }

  async deleteStock(id) {
    const stock = await this.stockRepository.findById(id);
    if (!stock) throw new Error('Stock not found.');

    // Business rule: cannot delete stock with active orders
    if (stock.orderQty > 0) {
      throw new Error(
        'Cannot delete stock that has active orders. Order quantity must be 0 before deleting.'
      );
    }

    return this.stockRepository.deleteById(id);
  }
}

module.exports = StockService;
