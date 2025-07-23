const router      = require('express').Router();
const upload      = require('../../middlewares/student_image_upload.middleware');
const controller  = require('../../controllers/frontend/student_reg_form.controller');

// POST /student/register
router.post('/register', controller.Student_Reg_Form);

// POST /student/apply
router.post('/apply', upload.single('profile_image'), controller.Student_App_Form);

// POST /student/login
router.post('/login', controller.Student_Login_Form);

module.exports = router;