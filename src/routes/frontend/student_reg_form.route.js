const router      = require('express').Router();
const upload      = require('../../middlewares/student_image_upload.middleware');
const Controller  = require('../../controllers/frontend/student_reg_form.Controller');

// POST /student/register
router.post('/register', Controller.RegisterStudent);

// Get Verify email
router.get('/verify-email', Controller.VerifyEmail);

// POST /student/login
router.post('/login', Controller.Student_Login);

// POST /student/apply
router.post('/apply', 
   upload.fields([
      { name: 'profile_image', maxCount: 1 },
      { name: 'signature_image', maxCount: 1 },
   ]
), Controller.Student_App_Form);


module.exports = router;