const mongoose = require('mongoose');

/**
 * StockModel - OOP class that builds the Stock Mongoose schema.
 * Tracks both total stockQty and currently reserved orderQty.
 */
class StockModel {
  constructor() {
    this.schema = new mongoose.Schema(
      {
        name: {
          type: String,
          required: [true, 'Stock name is required'],
          unique: true,
          trim: true,
          maxlength: [100, 'Stock name cannot exceed 100 characters'],
        },
        stockQty: {
          type: Number,
          required: [true, 'Stock quantity is required'],
          min: [1, 'Stock quantity must be at least 1'],
        },
        // Total qty currently reserved by orders
        orderQty: {
          type: Number,
          default: 0,
          min: [0, 'Order quantity cannot be negative'],
        },
      },
      { timestamps: true }
    );

    this._addVirtuals();
  }

  _addVirtuals() {
    // Computed available qty = stockQty - orderQty
    this.schema.virtual('availableQty').get(function () {
      return this.stockQty - this.orderQty;
    });
  }

  build() {
    return mongoose.model('Stock', this.schema);
  }
}

const stockModel = new StockModel();
module.exports = stockModel.build();
