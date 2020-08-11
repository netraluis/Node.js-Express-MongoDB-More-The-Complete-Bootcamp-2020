const express = require('express');

const router = express.Router();

const userRoutes = require('../controllers/userController');

const authController = require('../controllers/authController');

const userController = require('../controllers/userController');

// app.use('/api/v1/users', router);
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

// router.route('/forgotPassword').post(authController.forgotPassword);
// router.route('/resetPassword/:token').patch(authController.resetPassword);
// router
//   .route('/updateMyPassword')
//   .patch(authController.protect, authController.updatePassword);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.route('/').get(userRoutes.getAllUsers).post(userRoutes.createUser);
router.route('/:id').get(userRoutes.getUser).patch(userRoutes.updateUser);
// .delete(userRoutes.deleteUser);

module.exports = router;
