const Student_Registration = require('../../models/frontend/student_reg_form.model');

function generateApplicationId() {
  const prefix = "AASC";
  const timestamp = Date.now(); // milliseconds since epoch
  const randomNum = Math.floor(Math.random() * 10000); // 4 digit random
  return `${prefix}_${timestamp}_${randomNum}`;
}

// GET /Registration
exports.Student_App_Form = async (req, res) => {

   const application_id = generateApplicationId();
   
   // Convert date
   const dobFormatted = new Date(req.body.dob).toISOString().slice(0, 10); // 'YYYY-MM-DD'

   // Join SET field
   const activitiesString = req.body.extra_curicular_activities.join(',');

   // Validate GPA
   const englishGPA = Math.min(Number(req.body.english_gpa), 10); // sanitize

   const place = "Adoni";

   const payload = req.body;
   payload.application_id = application_id;
   payload.dob = dobFormatted;
   payload.extra_curicular_activities = activitiesString;
   payload.english_gpa = englishGPA;
   payload.place = place;
   // payload.created_at = new Date().toISOString().slice(0, 19).replace('T', ' '); // 'YYYY-MM-DD HH:MM:SS'
   // payload.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' '); // 'YYYY-MM-DD HH:MM:SS'
   
   try {
      const Register = await Student_Registration.Regsiter(req.body);
      res.status(201).json({ message: 'Registration Success', details: Register });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};