const express = require('express');
const router = express.Router();
const {
  catchErrors
} = require('../../../handlers/errorHandlers');
const dashboardController = require('../../../controllers/admin/dashboardController');

// @route  GET /dashboard
// @desc   Get dashboard Page
// @access Private
router.get('/', (req, res, next) => {
  res.redirect('/admin/dashboard');
  return;
});

module.exports = router;