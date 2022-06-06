const express = require('express');
const router = express.Router();
const multer = require('../util/multer2');
const { profile, RegisterUser, LoginUser, checkRole, getUser, getUsers, updateUser, deleteUser, userAuth } = require('../controller/user');
const {checkEmail, changePassword, forgotPassword, emailVerification_V1, emailVerification_V2} = require('../controller/security');
// const {  verification, getUnverifieds, getVendors, getVendorsByServices} = require('../controllers/vendor')
const {  uploadPicture, deletePicture} = require('../controller/picture')
const jwtAuth = require('../middleware/jwtAuth');
// const { getCinemaServices, getCinemaByTitle, getCinemaForUser, getCinemaById} = require('../controllers/services/cinema');
// const {getFoodByTitle, getFoodForUser, getFoodServices, getFoodById} = require('../controllers/services/food');
// const { getHotelByTitle, getHotelForUser, getHotelServices, getHotelById } = require('../controllers/services/hotel');
// const { getRentByTitle, getRentForUser, getRentServices, getRentById} = require('../controllers/services/renting');
// const {getStudioByTitle, getStudioForUser, getStudioServices, getStudioById} = require('../controllers/services/studio_book');
// const { getGamingByTitle, getGamingForUser, getGamingServices, getGameById} = require('../controllers/services/vr_gaming');
// const userVerify = require("../middleware/verify")
// const {bookHotel, hotelverify} = require('../controllers/Hotelbookings');
// const {getRestuarant, getRestuarants} = require('../controllers/restuarant')


//user
router
.post('/register-user', async (req, res) => {
    await RegisterUser("user", req, res)
});

router
.post('/signin-user', async (req, res) => {
    await LoginUser("user", req, res);
});


//admin
router
.post('/register-admin', async (req, res) => {
    await RegisterUser("admin", req, res)
});

router
.post('/signin-admin', async (req, res) => {
    await LoginUser("admin", req, res);
});


router
.route('/dashboard/profile')
.get(jwtAuth, getUser);

router
.route('/dashboard/profile/update')
.post(jwtAuth, updateUser);

router
.route('/dashboard/profile/upload-pic')
.post(jwtAuth, multer.single("image") ,uploadPicture);


router
.route('/dashboard/profile/delete-pic')
.delete(jwtAuth, deletePicture);


router
.route('/email-verification')
.post(jwtAuth, emailVerification_V1)
.get(emailVerification_V2);

router
.route('/reset-password')
.post(checkEmail)
.get(forgotPassword);

router
.route('/change-password')
.post(jwtAuth, changePassword);



module.exports = router;