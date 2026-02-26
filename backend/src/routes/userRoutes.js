const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getAllUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;