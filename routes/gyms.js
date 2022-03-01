const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateGym} = require('../middleware');
const gyms = require('../controllers/gyms');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage});


router.get('/', catchAsync(gyms.index));

router.get('/new', isLoggedIn, gyms.renderNewForm);

router.post('/', isLoggedIn ,upload.array('image'), validateGym ,  catchAsync(gyms.createGym));

router.get('/:id', catchAsync(gyms.showGym));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(gyms.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateGym , catchAsync(gyms.updateGym));

router.delete('/:id',isLoggedIn, isAuthor, catchAsync(gyms.deleteGym));

module.exports = router;