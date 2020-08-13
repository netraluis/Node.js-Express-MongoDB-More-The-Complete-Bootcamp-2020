// const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // try {
  //EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const tours = await features.query;
  // const tours = await query;

  //SEND QUERY
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `error `,
  //   });
  // }
});
exports.getTour = catchAsync(async (req, res, next) => {
  // try {
  // tour.findOne({
  //   _id:req.params.id
  // }) es lo mismo que findById
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No tour find with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `error `,
  //   });
  // }
});

exports.createTour = catchAsync(async (req, res, next) => {
  // try {
  // const newTour = new Tour()
  // newTour.save() abajo hacemos lo mismo
  const tour = await Tour.create(req.body);

  // 201 is created
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});
exports.updateTour = catchAsync(async (req, res, next) => {
  // tour.findOneAndUpdate({
  //   _id:req.params.id
  // }) es lo mismo que findById
  // try {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: 'true',
    runValidators: 'true',
  });
  if (!tour) {
    return next(new AppError('No tour find with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: 'invalid data sent!',
  //   });
  // }
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  // try {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('No tour find with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: 'invalid data sent!',
  //   });
  // }
});

exports.getTourStates = catchAsync(async (req, res, next) => {
  // try {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      tour: stats,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.getMonthPlan = catchAsync(async (req, res, next) => {
  // try {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 6,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: plan,
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});
