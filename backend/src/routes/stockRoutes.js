const express = require('express');
const stockController = require('../controllers/StockController');
const auth = require('../middleware/auth');

const router = express.Router();

// All stock routes require authentication
router.use(auth);

router.get('/',     stockController.getAllStocks);
router.post('/',    stockController.createStock);
router.delete('/:id', stockController.deleteStock);

module.exports = router;
