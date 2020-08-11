const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'invalid email'],
  },
  password: {
    type: String,
    required: [true, 'Must use a password'],
    minlength: [8, 'password must have more or equal to 5'],
    //para qeeu no se muestre
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Must confirm your password'],
    validate: {
      validator: function (val) {
        //solo funciona en la creacion no en el update
        return val === this.password;
      },
      message: 'password and confirmPassword must be equal ',
    },
  },

  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  //solo se ejecuta si el passwrd ha sido modificado
  if (!this.isModified('password')) return next();
  //encripta password con crypt coste 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;

  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  //this se refiere a una instancia de este documento y solo funciona en function()
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return changedTimestamp > JWTTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  //cryptp es un modulo de node para encriptar
  const resetToken = crypto.randomBytes(32).toString('hex');
  //encriptamos para guardarlo en la base de datos
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // enviamos por email el no encriptado
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
