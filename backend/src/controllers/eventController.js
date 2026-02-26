const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Event = require('../models/Event');

// @desc      Get all events
// @route     GET /api/events
// @access    Public
exports.getAllEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.find().populate('organizer', 'name email');

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

// @desc      Get single event
// @route     GET /api/events/:id
// @access    Public
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name email');

  if (!event) {
    return next(
      new ErrorResponse(`No event found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc      Create event
// @route     POST /api/events
// @access    Private/Organizer
exports.createEvent = asyncHandler(async (req, res, next) => {
  // Add organizer to req.body
  req.body.organizer = req.user.id;

  const event = await Event.create(req.body);

  res.status(201).json({
    success: true,
    data: event
  });
});

// @desc      Update event
// @route     PUT /api/events/:id
// @access    Private/Organizer
exports.updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`No event found with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the organizer or admin
  if (event.organizer.toString() !== req.user.id && req.user.role !== 'ADMIN') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this event`,
        401
      )
    );
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc      Delete event
// @route     DELETE /api/events/:id
// @access    Private/Admin
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`No event found with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the organizer or admin
  if (event.organizer.toString() !== req.user.id && req.user.role !== 'ADMIN') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this event`,
        401
      )
    );
  }

  await event.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Get events by organizer
// @route     GET /api/events/organizer/:organizerId
// @access    Private
exports.getEventsByOrganizer = asyncHandler(async (req, res, next) => {
  const events = await Event.find({ organizer: req.params.organizerId });

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});