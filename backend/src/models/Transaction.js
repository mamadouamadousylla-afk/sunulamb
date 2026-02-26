const mongoose = require('mongoose');
const db = require('../config/db');

const transactionSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: [true, 'Please add a reference'],
    unique: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Please add an event']
  },
  ticketIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [1, 'Amount must be at least 1']
  },
  currency: {
    type: String,
    default: 'XOF'
  },
  paymentMethod: {
    type: String,
    enum: ['WAVE', 'ORANGE_MONEY', 'FREE_MONEY'],
    required: [true, 'Please add a payment method']
  },
  providerRef: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = {
  findById: (id) => db.Transaction.findById(id),
  findByUserId: (userId) => db.Transaction.findByUserId(userId),
  findByEventId: (eventId) => db.Transaction.findByEventId(eventId),
  findAll: () => db.Transaction.findAll(),
  create: (transactionData) => db.Transaction.create(transactionData),
  updateById: (id, updateData) => db.Transaction.updateById(id, updateData),
  deleteById: (id) => db.Transaction.deleteById(id)
};
