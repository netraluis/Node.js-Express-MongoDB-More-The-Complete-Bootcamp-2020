const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'tour schema necesita nombre'],
      unique: true,
      maxlength: [40, 'Tour name must have les or equal to 40'],
      minlength: [10, 'Tour name must have more or equal to 10'],
      // validate: [validator.isAlpha, 'solamente alphanumericos'],
    },

    slug: {
      type: String,
    },

    duration: {
      type: Number,
      required: [true, 'tour schema necesita duracion'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'tour schema necesita max group'],
    },
    difficulty: {
      type: String,
      required: [true, 'tour schema necesita max dificulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is easy medium or difficult ',
      },
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'rating must be above 1'],
      max: [5, 'rating must be below 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'tour schema necesita precio'],
    },
    priceDiscount: {
      type: Number,
      //creando un validador
      validate: {
        validator: function (val) {
          //solo funciona en la creacion no en el update
          return val <= this.price;
        },
        message: 'Discount can´t be above price ',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'tour schema necesita description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'tour schema necesita imagenCover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //Geo Json
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    //embedded dataset
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        // establish data reference
        // type mongo db Id
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  //no arrow function 103
  return this.duration / 7;
});

//document MIDDLEWARE: runs before .save() and .create(), es decir cuando creamos algo
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// embedd guides into tours
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.mapa(
//     async (id) => await URLSearchParams.findById(id)
//   );
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

//NO BORRAR

// tourSchema.pre('save', function (next) {
//   console.log('will save doc...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  //   console.log(docs);
  //   console.log(`query took: ${Date.now() - this.start} milliseconds`);
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v',
  });
  next();
});
//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  //   console.log(this.pipeline());
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
