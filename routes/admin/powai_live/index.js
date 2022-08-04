const express = require('express');
const router = express.Router();
const {
  catchErrors
} = require('../../../handlers/errorHandlers');
const userType = require('../../../controllers/admin/userController');
const dashboardController = require('../../../controllers/admin/dashboardController');

// @route  GET /dashboard
// @desc   Get dashboard Page
// @access Private
router.get('/dashboard',
  userType.requireRole('admin'),
  dashboardController.getDashboard
);

module.exports = router;