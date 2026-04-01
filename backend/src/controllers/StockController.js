const StockService = require('../services/StockService');

/**
 * StockController - HTTP layer for stock management.
 * OOP class with bound methods for Express route handlers.
 */
class StockController {
  constructor() {
    this.stockService  = new StockService();
    this.getAllStocks   = this.getAllStocks.bind(this);
    this.createStock   = this.createStock.bind(this);
    this.deleteStock   = this.deleteStock.bind(this);
  }

  async getAllStocks(req, res, next) {
    try {
      const stocks = await this.stockService.getAllStocks();
      res.json({ stocks });
    } catch (err) { next(err); }
  }

  async createStock(req, res, next) {
    try {
      const { name, stockQty } = req.body;
      const stock = await this.stockService.createStock(name, stockQty);
      res.status(201).json({ message: 'Stock created successfully.', stock });
    } catch (err) { next(err); }
  }

  async deleteStock(req, res, next) {
    try {
      await this.stockService.deleteStock(req.params.id);
      res.json({ message: 'Stock deleted successfully.' });
    } catch (err) { next(err); }
  }
}

module.exports = new StockController();
