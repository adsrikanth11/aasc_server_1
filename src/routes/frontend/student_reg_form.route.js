const router      = require('express').Router();
const controller  = require('../../controllers/frontend/student_reg_form.controller');

// POST /student/register
router.post('/apply', controller.Student_App_Form);

module.exports = router;