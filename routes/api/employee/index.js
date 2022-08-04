const express = require('express');
const router = express.Router();
// const {
//   catchErrors
// } = require('../../../handlers/errorHandlers');
// const Auth = require('../../../handlers/passport');
const employeeController = require('../../../controllers/api/employeeController');



router.get('/all',
  employeeController.test
);

router.get('/user?',
  employeeController.user
);

// router.get('/ur',
//   accountController.test
// );

module.exports = router;