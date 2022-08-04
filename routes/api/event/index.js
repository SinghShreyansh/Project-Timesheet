const express = require('express');
const router = express.Router();
const {
  catchErrors
} = require('../../../handlers/errorHandlers');
// const Auth = require('../../../handlers/passport');
const eventsController = require('../../../controllers/api/eventsController');

router.get('/all',
  catchErrors(eventsController.checkDate),
  catchErrors(eventsController.getAllDeals)
);

router.get('/:id',
  catchErrors(eventsController.getEvent)
);

module.exports = router;