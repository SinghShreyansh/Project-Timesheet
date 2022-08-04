const express = require('express');
const router = express.Router();
// const {
//   catchErrors
// } = require('../../../handlers/errorHandlers');
// const Auth = require('../../../handlers/passport');
const dashboardController = require('../../../controllers/admin/dashboardController');

// router.get('/all/user',
//   dashboardController.test1
// );

// router.get('/all',
//   dashboardController.test
// );

router.post('/adduser',
  dashboardController.addUser
);



module.exports = router;