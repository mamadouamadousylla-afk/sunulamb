const express = require('express');
const { protect } = require('../middleware/auth');
const { 
  processPayment, 
  getPayment, 
  getPayments,
  refundPayment
} = require('../controllers/paymentController');

const router = express.Router();

router.route('/').get(protect, getPayments).post(protect, processPayment);
router.route('/:id').get(protect, getPayment);
router.route('/refund/:id').put(protect, refundPayment);

module.exports = router;