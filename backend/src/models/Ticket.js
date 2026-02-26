const mongoose = require('mongoose');
const db = require('../config/db');

const ticketSchema = new mongoose.Schema({
  qrCode: {
    type: String,
    required: [true, 'Please add a QR code'],
    unique: true,
    trim: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Please add an event']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['VIP', 'TRIBUNE', 'PELOUSE'],
    trim: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'VALIDATED', 'CANCELLED'],
    default: 'ACTIVE'
  },
  purchaseDate: {
    type: Date,
    required: false
  },
  validationDate: {
    type: Date,
    required: false
  },
  validationCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = {
  findById: (id) => db.Ticket.findById(id),
  findByUserId: (userId) => db.Ticket.findByUserId(userId),
  findByEventId: (eventId) => db.Ticket.findByEventId(eventId),
  findAll: () => db.Ticket.findAll(),
  create: (ticketData) => db.Ticket.create(ticketData),
  updateById: (id, updateData) => db.Ticket.updateById(id, updateData),
  deleteById: (id) => db.Ticket.deleteById(id)
};
