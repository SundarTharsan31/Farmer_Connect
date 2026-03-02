const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { check } = require('express-validator');

// Validation rules
const updateProfileValidation = [
    check('name').optional().notEmpty().withMessage('Name cannot be empty'),
    check('email').optional().isEmail().withMessage('Invalid email format'),
    check('mobile').optional().notEmpty().withMessage('Mobile cannot be empty'),
];

// GET user profile
router.get('/profile', requireAuth, userController.getProfile);

// PUT update user profile
router.put('/profile', requireAuth, validate(updateProfileValidation), userController.updateProfile);

// POST upload document (Aadhar/GST)
router.post('/upload-document', requireAuth, upload.single('document'), userController.uploadDocument);

// POST upload profile photo
router.post('/upload-photo', requireAuth, upload.single('photo'), userController.uploadProfilePhoto);

// PUT update user location
router.put('/location', requireAuth, userController.updateLocation);

// PUT update user preferences
router.put('/preferences', requireAuth, userController.updatePreferences);

module.exports = router;
