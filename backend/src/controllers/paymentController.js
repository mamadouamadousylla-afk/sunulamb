const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Transaction = require('../models/Transaction');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

// @desc      Process payment
// @route     POST /api/payments
// @access    Private
exports.processPayment = asyncHandler(async (req, res, next) => {
  const { eventId, ticketIds, amount, paymentMethod } = req.body;

  // Validate required fields
  if (!eventId || !ticketIds || !amount || !paymentMethod) {
    return next(new ErrorResponse('Please provide event ID, ticket IDs, amount, and payment method', 400));
  }

  // Verify event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new ErrorResponse(`No event found with the id of ${eventId}`, 404));
  }

  // Verify user owns the tickets
  for (const ticketId of ticketIds) {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return next(new ErrorResponse(`No ticket found with the id of ${ticketId}`, 404));
    }
    if (ticket.user.toString() !== req.user.id) {
      return next(new ErrorResponse(`User does not own ticket ${ticketId}`, 401));
    }
  }

  // Create transaction
  const transaction = await Transaction.create({
    reference: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    user: req.user.id,
    event: eventId,
    ticketIds: ticketIds,
    amount,
    paymentMethod,
    status: 'PENDING'
  });

  // In a real app, you would integrate with a payment processor here
  // For now, we'll simulate a successful payment
  setTimeout(async () => {
    try {
      transaction.status = 'COMPLETED';
      await transaction.save();

      // Update ticket status to active
      await Ticket.updateMany(
        { _id: { $in: ticketIds } },
        { 
          status: 'ACTIVE',
          purchaseDate: Date.now()
        }
      );

      // Reduce available tickets in the event
      event.availableTickets -= ticketIds.length;
      await event.save();
    } catch (error) {
      console.error('Error updating transaction after payment:', error);
    }
  }, 2000); // Simulate 2-second payment processing

  res.status(200).json({
    success: true,
    data: transaction
  });
});

// @desc      Get single payment
// @route     GET /api/payments/:id
// @access    Private
exports.getPayment = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('user', 'name email')
    .populate('event', 'title date location');

  if (!transaction) {
    return next(
      new ErrorResponse(`No transaction found with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the transaction owner or admin
  if (transaction.user._id.toString() !== req.user.id && req.user.role !== 'ADMIN') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this transaction`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: transaction
  });
});

// @desc      Get all payments for user
// @route     GET /api/payments
// @access    Private
exports.getPayments = asyncHandler(async (req, res, next) => {
  // If admin, get all transactions; otherwise, get only user's transactions
  const filter = req.user.role === 'ADMIN' ? {} : { user: req.user.id };

  const transactions = await Transaction.find(filter)
    .populate('user', 'name email')
    .populate('event', 'title date location')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions
  });
});

// @desc      Refund payment
// @route     PUT /api/payments/refund/:id
// @access    Private/Admin
exports.refundPayment = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return next(
      new ErrorResponse(`No transaction found with the id of ${req.params.id}`, 404)
    );
  }

  // Only admins can process refunds
  if (req.user.role !== 'ADMIN') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to process refunds`,
        401
      )
    );
  }

  if (transaction.status !== 'COMPLETED') {
    return next(
      new ErrorResponse('Cannot refund a transaction that is not completed', 400)
    );
  }

  // Update transaction status to refunded
  transaction.status = 'REFUNDED';
  await transaction.save();

  // Update ticket statuses back to inactive
  await Ticket.updateMany(
    { _id: { $in: transaction.ticketIds } },
    { status: 'ACTIVE' } // Keeping them as active but they're refunded
  );

  // Increase available tickets in the event
  const event = await Event.findById(transaction.event);
  event.availableTickets += transaction.ticketIds.length;
  await event.save();

  res.status(200).json({
    success: true,
    data: transaction
  });
});