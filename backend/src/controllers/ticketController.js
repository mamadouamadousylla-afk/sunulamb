const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

// @desc      Get all tickets
// @route     GET /api/tickets
// @access    Private/Admin
exports.getAllTickets = asyncHandler(async (req, res, next) => {
  const tickets = await Ticket.find().populate('user event', 'name title');

  res.status(200).json({
    success: true,
    count: tickets.length,
    data: tickets
  });
});

// @desc      Get single ticket
// @route     GET /api/tickets/:id
// @access    Private
exports.getTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id).populate('user event', 'name title');

  if (!ticket) {
    return next(
      new ErrorResponse(`No ticket found with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the ticket owner or admin
  if (ticket.user.toString() !== req.user.id && req.user.role !== 'ADMIN') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this ticket`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: ticket
  });
});

// @desc      Create ticket
// @route     POST /api/tickets
// @access    Private
exports.createTicket = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check if event exists and has available tickets
  const event = await Event.findById(req.body.event);
  if (!event) {
    return next(
      new ErrorResponse(`No event found with the id of ${req.body.event}`, 404)
    );
  }

  if (event.availableTickets <= 0) {
    return next(
      new ErrorResponse('No tickets available for this event', 400)
    );
  }

  // Generate QR code (in a real app, you'd use a QR code library)
  req.body.qrCode = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const ticket = await Ticket.create(req.body);

  // Update available tickets in the event
  event.availableTickets -= 1;
  await event.save();

  res.status(201).json({
    success: true,
    data: ticket
  });
});

// @desc      Update ticket
// @route     PUT /api/tickets/:id
// @access    Private/Admin
exports.updateTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`No ticket found with the id of ${req.params.id}`, 404)
    );
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: updatedTicket
  });
});

// @desc      Delete ticket
// @route     DELETE /api/tickets/:id
// @access    Private/Admin
exports.deleteTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`No ticket found with the id of ${req.params.id}`, 404)
    );
  }

  await ticket.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Validate ticket
// @route     PUT /api/tickets/validate/:qrCode
// @access    Private/Organizer/Admin
exports.validateTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findOne({ qrCode: req.params.qrCode }).populate('event', 'title date');

  if (!ticket) {
    return next(
      new ErrorResponse(`No ticket found with the QR code: ${req.params.qrCode}`, 404)
    );
  }

  // Make sure user is the event organizer or admin
  if (ticket.event.organizer.toString() !== req.user.id && req.user.role !== 'ADMIN') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to validate this ticket`,
        401
      )
    );
  }

  // Update validation status
  ticket.status = 'VALIDATED';
  ticket.validationDate = Date.now();
  ticket.validationCount += 1;
  await ticket.save();

  res.status(200).json({
    success: true,
    data: ticket
  });
});

// @desc      Get tickets by user
// @route     GET /api/tickets/user/:userId
// @access    Private
exports.getTicketsByUser = asyncHandler(async (req, res, next) => {
  // Make sure user is accessing their own tickets or is admin
  if (req.params.userId !== req.user.id && req.user.role !== 'ADMIN') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access these tickets`,
        401
      )
    );
  }

  const tickets = await Ticket.find({ user: req.params.userId }).populate('event', 'title date location');

  res.status(200).json({
    success: true,
    count: tickets.length,
    data: tickets
  });
});

// @desc      Get tickets by event
// @route     GET /api/tickets/event/:eventId
// @access    Private/Organizer/Admin
exports.getTicketsByEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    return next(
      new ErrorResponse(`No event found with the id of ${req.params.eventId}`, 404)
    );
  }

  // Make sure user is the event organizer or admin
  if (event.organizer.toString() !== req.user.id && req.user.role !== 'ADMIN') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access these tickets`,
        401
      )
    );
  }

  const tickets = await Ticket.find({ event: req.params.eventId }).populate('user', 'name email');

  res.status(200).json({
    success: true,
    count: tickets.length,
    data: tickets
  });
});