const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();
//1. create checkbody middleware
//2. check if body contains property name and price
//3. if not send 400
//4. Add it to the post handler stack
// router.param('id', tourController.checkID);
// app.get('/api/v1/tours', getAllTours);
// app.use('/api/v1/tours', tourRouter);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
//sería el equivalente
// app.route('/api/v1/tours').get(getAllTours).post(createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
