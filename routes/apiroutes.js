const express = require('express');
const router = express.Router();
const multer = require('../util/multer2');
const { profile, RegisterUser, LoginUser, checkRole, getUser, getUsers, updateUser, deleteUser, userAuth, userTransaction, allTransaction } = require('../controller/user');
const {checkEmail, changePassword, forgotPassword, emailVerification_V1, emailVerification_V2} = require('../controller/security');
// const {  verification, getUnverifieds, getVendors, getVendorsByServices} = require('../controllers/vendor')
const {  uploadPicture, deletePicture} = require('../controller/picture')
const jwtAuth = require('../middleware/jwtAuth');
const {getBillers, getDataBundle, validateBill, createBill, validateBVN} = require('../controller/Biller');
const {addToWallet, verify} = require('../controller/wallet');
// const { getCinemaServices, getCinemaByTitle, getCinemaForUser, getCinemaById} = require('../controllers/services/cinema');
// const {getFoodByTitle, getFoodForUser, getFoodServices, getFoodById} = require('../controllers/services/food');
// const { getHotelByTitle, getHotelForUser, getHotelServices, getHotelById } = require('../controllers/services/hotel');
// const { getRentByTitle, getRentForUser, getRentServices, getRentById} = require('../controllers/services/renting');
// const {getStudioByTitle, getStudioForUser, getStudioServices, getStudioById} = require('../controllers/services/studio_book');
// const { getGamingByTitle, getGamingForUser, getGamingServices, getGameById} = require('../controllers/services/vr_gaming');
// const userVerify = require("../middleware/verify")
// const {bookHotel, hotelverify} = require('../controllers/Hotelbookings');
// const {getRestuarant, getRestuarants} = require('../controllers/restuarant')


router.get('/', (req, res) => {
    return res.send({
        name: "Moshood"
    })
})

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

router.get('/admin/getAllUsers', jwtAuth, getUsers)


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


router.get('/user/transaction', jwtAuth, userTransaction)
router.get('/transactions', jwtAuth, allTransaction)

router
.route('/change-password')
.post(jwtAuth, changePassword);

router.get("/getBiller", getBillers);
router.get("/getDataBundle", getDataBundle);
router.post("/validateBill", validateBill);
router.post("/createBill", createBill);
router.post("/validateBVN", validateBVN);

router.post("/deposit-wallet", jwtAuth, addToWallet);

router.post("/api/pay/verify", verify);





module.exports = router;