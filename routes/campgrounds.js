const express = require('express');
const router = express.Router()
const campgrounds = require('../controllers/campgrounds')
const wrapAsync = require('../utils/wrapAsync');
const multer  = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({ storage })

const { isLoggedIn, isAuthor, validateSchema } = require('../middleware')

router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'), validateSchema, wrapAsync(campgrounds.newCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(wrapAsync(campgrounds.show))
    .put(isLoggedIn, isAuthor, upload.array('image'),validateSchema, wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground))


router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEdit))


module.exports = router
