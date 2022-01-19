const router = require('express').Router();
const adminController = require('../controllers/adminController');
const {uploadSingel, uploadMultiple} = require('../middlewares/multer');
const auth = require('../middlewares/auth');


router.get('/signin', adminController.viewSigin);
router.post('/signin', adminController.actionSignin);

// sebelum masuk kedashboard harus melewati authorization terlebih dahulu
router.use(auth);
// logout
router.get('/logout', adminController.actionLogout);

router.get('/dashboard', adminController.viewDashboard);
// endpoint category
router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);

// endpoint bank
router.get('/bank', adminController.viewBank);
router.post('/bank', uploadSingel, adminController.addBank);
router.put('/bank', uploadSingel, adminController.editBank);
router.delete('/bank/:id', adminController.deleteBank);

// endpoint Item
router.get('/item', adminController.viewItem);
router.post('/item', uploadMultiple, adminController.addItem);
router.get('/item/show-image/:id', adminController.showImageItem);
router.get('/item/:id', adminController.showEditItem);
router.put('/item/:id', uploadMultiple, adminController.editItem);
router.delete('/item/:id', adminController.deleteItem);

// endPoint detail item
router.get('/item/show-detail-item/:itemId', adminController.viewDetailItems)
router.post('/item/add/feature', uploadSingel, adminController.addFeature);
router.put('/item/update/feature', uploadSingel, adminController.editFeature);
router.delete('/item/:itemId/feature/:id', adminController.deleteFeature);

// enpoint activity
router.post('/item/add/activity', uploadSingel, adminController.addActivity);
router.put('/item/update/activity', uploadSingel, adminController.editActivity);
router.delete('/item/:itemId/activity/:id', adminController.deleteActivity);

// enpoint booking
router.get('/booking', adminController.viewBooking);
router.get('/booking/:id', adminController.showDeatailBooking);
// ubah status
router.put('/booking/:id/confirmation', adminController.actionConfirmation);
router.put('/booking/:id/reject', adminController.actionReject);


module.exports = router;