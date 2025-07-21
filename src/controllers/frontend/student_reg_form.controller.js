const jwt   = require('jsonwebtoken');
const Student_Registration = require('../../models/frontend/student_reg_form.model');

function generateApplicationId() {
  const prefix = "AASC";
  const timestamp = Date.now(); // milliseconds since epoch
  const randomNum = Math.floor(Math.random() * 10000); // 4 digit random
  return `${prefix}_${timestamp}_${randomNum}`;
}

// POST /Registration
exports.Student_Reg_Form = async (req, res) => {
   try {
      const Register = await Student_Registration.Regsiter(req.body);
      res.status(201).json({ message: 'Registration Success', details: Register });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// POST /Apply
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
      const Apply = await Student_Registration.Apply(req.body);
      res.status(201).json({ message: 'Application Submitted Succesfully', application_id: application_id });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// POST /Login
exports.Student_Login_Form = async (req, res) => {
   let { username, password } = req.body;
   // Validation: required fields
   if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
   }
   try {
      const login_info = await Student_Registration.Login(username);
      // res.json({ message: 'Login Success', details: login_info });
      if (!login_info) {
         return res.status(404).json({ message: 'Username not found' });
      }
      if (login_info.password !== password) {
         return res.status(401).json({ message: 'Invalid password' });
      }
      // verify password 
      if(login_info.password === password) {
         // Generate JWT token
         const token = jwt.sign(req.body, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
         // Return user data and token
         res.status(200).json({
            username: login_info.username,
            token,
         });
      }
   } catch (error) {
      res.status(500).json({ message: 'Failed to login', error: error.message });
   }
};