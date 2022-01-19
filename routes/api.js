const router = require('express').Router();
const apiController = require('../controllers/apiController');
const {uploadSingel} = require('../middlewares/multer');

router.get('/landing-page', apiController.landingPage);
router.get('/detail-page/:id', apiController.detailPage);
router.post('/booking-page', uploadSingel, apiController.bookingPage);

module.exports = router;