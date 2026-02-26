const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { 
  getAllEvents, 
  getEvent, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  getEventsByOrganizer
} = require('../controllers/eventController');

const router = express.Router();

router.route('/').get(getAllEvents).post(protect, authorize('ADMIN', 'ORGANIZER'), createEvent);
router.route('/:id').get(getEvent).put(protect, authorize('ADMIN', 'ORGANIZER'), updateEvent).delete(protect, authorize('ADMIN'), deleteEvent);
router.route('/organizer/:organizerId').get(protect, getEventsByOrganizer);

module.exports = router;