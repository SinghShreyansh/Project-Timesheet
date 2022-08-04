const express = require('express');
const router = express.Router();
// const {
//   catchErrors
// } = require('../../../handlers/errorHandlers');
// const Auth = require('../../../handlers/passport');
const userController = require('../../../controllers/admin/userController');

// router.get('/all/user',
//   dashboardController.test1
// );

// router.get('/all',
//   dashboardController.test
// );

router.get('/user/all',
  userController.usersData
);



module.exports = router;