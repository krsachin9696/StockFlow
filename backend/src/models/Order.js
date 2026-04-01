const mongoose = require('mongoose');

/**
 * OrderModel - OOP class that builds the Order Mongoose schema.
 * Stores a snapshot of stockName for display even if stock is later modified.
 */
class OrderModel {
  constructor() {
    this.schema = new mongoose.Schema(
      {
        customerName: {
          type: String,
          required: [true, 'Customer name is required'],
          trim: true,
          maxlength: [100, 'Customer name cannot exceed 100 characters'],
        },
        stockId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Stock',
          required: [true, 'Stock reference is required'],
        },
        // Snapshot of stock name at order creation time
        stockName: {
          type: String,
          required: [true, 'Stock name is required'],
          trim: true,
        },
        orderQty: {
          type: Number,
          required: [true, 'Order quantity is required'],
          min: [1, 'Order quantity must be at least 1'],
        },
      },
      { timestamps: true }
    );
  }

  build() {
    return mongoose.model('Order', this.schema);
  }
}

const orderModel = new OrderModel();
module.exports = orderModel.build();
