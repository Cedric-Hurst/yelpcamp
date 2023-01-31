const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor, validateCamp } = require('../middleware');
// utils
const catchAsync = require('../utils/catchAsync'); 
// controllers
const camps = require('../controllers/camps');
const { storage } = require('../cloudinary');
const multer  = require('multer')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(camps.index))
    .post(isLoggedIn, upload.array('image'), validateCamp, catchAsync(camps.createCamp));
router.get('/new', isLoggedIn, camps.newPage);
router.route('/:id')
    .get(catchAsync(camps.showPage))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCamp, catchAsync(camps.editCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(camps.deleteCamp));
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(camps.editPage));

module.exports = router;