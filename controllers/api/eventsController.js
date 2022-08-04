const Event = require('../../models/Event');
const response = require('../../handlers/response');

exports.checkDate = async (req, res, next) => {
  let ids = [];
  const events = await Event.find({
    status: 'active'
  });
  if (events) {
    events.map(async event => {
      let eventDate = new Date(`${event.starting_date}`).getTime();

      let currentDate = new Date().toISOString().split("T")[0];
      let FinalDate = new Date(`${currentDate}T00:00:00.000Z`);
      var currentFinalDatePlusOneDay = new Date(FinalDate.getTime() - 86400000).getTime();

      if (currentFinalDatePlusOneDay >= eventDate) ids.push(event._id);
    });
    const updateDeals = await Event.updateMany({
      _id: {
        $in: ids
      }
    }, {
      status: "inactive"
    }, {
      multi: true
    }).exec();
    next();
  } else {
    return res.status(400).json(response.responseError('No deals yet', 400));
  }
};

exports.getAllDeals = async (req, res, next) => {
  const events = await Event.find({
    status: 'active'
  }, {
    location: 0,
    image_gallery: 0,
    status: 0,
    success: 0,
    createdAt: 0,
    updatedAt: 0
  }).sort({
    createdAt: 'desc'
  });
  if (events.length) return res.status(200).json(response.responseSuccess('All Events', events, 200));
  return res.status(400).json(response.responseError('No events yet', 400));
};

exports.getEvent = async (req, res, next) => {
  const event = await Event.findOne({
    _id: req.params.id
  }, {
    success: 0,
    createdAt: 0,
    updatedAt: 0,
    status: 0
  });
  if (event) return res.status(200).json(response.responseSuccess('Event', event, 200));
  return res.status(400).json(response.responseError('Event not found', 400));
};