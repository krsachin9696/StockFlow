const express = require('express');
const orderController = require('../controllers/OrderController');
const auth = require('../middleware/auth');

const router = express.Router();

// All order routes require authentication
router.use(auth);

router.get('/',       orderController.getAllOrders);
router.post('/',      orderController.createOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
