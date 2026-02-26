const mongoose = require('mongoose');
const db = require('../config/db');

module.exports = {
  findById: (id) => db.Event.findById(id),
  findAll: () => db.Event.findAll(),
  create: (eventData) => db.Event.create(eventData),
  updateById: (id, updateData) => db.Event.updateById(id, updateData),
  deleteById: (id) => db.Event.deleteById(id)
};

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  description: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  time: {
    type: String,
    required: [true, 'Please add a time']
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
    trim: true
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'],
    default: 'SCHEDULED'
  },
  heroImage: {
    type: String,
    default: ''
  },
  totalTickets: {
    type: Number,
    required: [true, 'Please add total tickets'],
    min: [1, 'Total tickets must be at least 1']
  },
  availableTickets: {
    type: Number,
    required: [true, 'Please add available tickets'],
    min: [0, 'Available tickets cannot be negative']
  },
  deadline: {
    type: Date,
    required: false
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);