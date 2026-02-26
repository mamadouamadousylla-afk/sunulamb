const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { 
  getAllTickets, 
  getTicket, 
  createTicket, 
  updateTicket, 
  deleteTicket,
  validateTicket,
  getTicketsByUser,
  getTicketsByEvent
} = require('../controllers/ticketController');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/').get(authorize('ADMIN'), getAllTickets).post(createTicket);
router.route('/:id').get(getTicket).put(updateTicket).delete(deleteTicket);
router.route('/validate/:qrCode').put(validateTicket);
router.route('/user/:userId').get(getTicketsByUser);
router.route('/event/:eventId').get(getTicketsByEvent);

module.exports = router;