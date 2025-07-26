const jwt            = require('jsonwebtoken');
const bcrypt         = require('bcrypt');
const Model          = require('../../models/frontend/student_reg_form.model');
const generate_app_id = require('../../utils/generate_app_id.util');
const generateToken  = require('../../utils/generateToken.util');
const transporter    = require('../../config/mailer.config');

// This endpoint handles student registration and sends a verification email
exports.RegisterStudent = async (req, res) => {
   const { username, password, email, mobile } = req.body;

   try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const data = { username, password:hashedPassword, email, mobile };
      const result = await Model.Register_Student(data);

      const token = generateToken(result.insertId);
      const verificationLink = `http://localhost:${process.env.PORT}/student/verify-email?token=${token}`;

      try {
         await transporter.sendMail({
            from: '"Adoni Arts & Science College" <aasccollege@example.com>',
            to: email,
            subject: 'Verify your email',
            html: `
               <h4>Hello ${username},</h4>
               <p>Please verify your email by clicking the link below:</p>
               <a href="${verificationLink}">${verificationLink}</a>
            `,
         });
      } catch (emailError) {
         console.error('Email sending failed:', emailError.message);
         // Optional: Delete the user record or mark as unverified
      }

      return res.status(200).json({ message: 'Registration successful. Please check your email to verify.' });

   } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
         if (error.sqlMessage.includes('uq_username')) {
            return res.status(409).json({ message: "Username already registered." });
         } else if (error.sqlMessage.includes('uq_email')) {
            return res.status(409).json({ message: "Email already registered." });
         } else if (error.sqlMessage.includes('uq_mobile')) {
            return res.status(409).json({ message: "Mobile number already registered." });
         }
         return res.status(409).json({ message: "Duplicate entry." });
      }

      return res.status(500).json({ message: "Server error. Please try again later." });
   }
};

// This endpoint verifies the user's email using a JWT token
exports.VerifyEmail = async (req, res) => {
   const token = req.query.token;
   if (!token) {
      return res.status(400).json({ message: 'Token is required' });
   }
   try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Update the student's is_verified status in the database
      const result = await Model.Verif_Email(decoded.userId);

      if (result.affectedRows === 0) {
         return res.status(404).json({ message: 'User not found or already verified' });
      }
      
      res.send('<h2>Email verified successfully. You can now log in.</h2>');
   } catch (err) {
      console.error(err);
      // Detect expiry
      if (err.name === 'TokenExpiredError') {
         res.send(`
            <h2>Verification link expired.</h2>
            <p><a href="/resend-verification-page">Click here to resend verification email</a></p>
         `);
      } else {
         res.status(400).send('Invalid verification link');
      }
   }
}

// This endpoint handles student login and returns a JWT token if successful
exports.Student_Login = async (req, res) => {
   const { username, password } = req.body;

   // Validation: required fields
   if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
   }

   try {
      // const [users] = await pool.query('SELECT * FROM students WHERE username = ?', [username]);
      // const user = users[0];

      const user = await Model.Student_Login(username);
      console.log('User fetched:', user);
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      // Check if email is verified
      if (!user.is_verified) {
         return res.status(401).json({ message: 'Email not verified. Please check your inbox.' });
      }

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(401).json({ message: 'Incorrect password' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
         expiresIn: process.env.JWT_EXPIRES_IN,
      });

      // In production: use secure HttpOnly cookies
      res.status(200).json({
         message: 'Login successful',
         token,
         user: {
            username: user.username,
            email: user.email,
         },
      });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
   }
};

// This endpoint handles student application form submission
exports.Student_App_Form = async (req, res) => {
   const application_id = generate_app_id();

   try {
      //  Ensure both files are uploaded
      if (!req.files?.profile_image || !req.files.profile_image[0]) {
         return res.status(400).json({ message: 'Profile image is required' });
      }
      if (!req.files?.signature_image || !req.files.signature_image[0]) {
         return res.status(400).json({ message: 'Signature image is required' });
      }

      //  Format fields
      const dobFormatted = new Date(req.body.dob).toISOString().slice(0, 10);
      const activitiesString = Array.isArray(req.body.extra_curicular_activities)
         ? req.body.extra_curicular_activities.join(',')
         : req.body.extra_curicular_activities || '';

      const englishGPA = Math.min(Number(req.body.english_gpa), 10);
      const place = "Adoni";

      //  Assign image filenames
      const profileImage = req.files.profile_image[0].filename;
      const signatureImage = req.files.signature_image[0].filename;

      //  Construct payload
      const payload = {
         ...req.body,
         application_id,
         dob: dobFormatted,
         extra_curicular_activities: activitiesString,
         english_gpa: englishGPA,
         place,
         profile_image: profileImage,
         signature_image: signatureImage
      };

      //  Save application to DB
      const result = await Model.Application_Form(payload);
      if (!result) {
         return res.status(500).json({ message: 'Failed to save application' });
      }

      //  Send confirmation email
      const fullName = req.body.full_name || 'Student';
      const userEmail = req.body.email_id;
      if (userEmail) {
         const full_subject = `Application Submitted Successfully - ID: ${application_id}`;
         const emailMessage = `
            <p>Dear ${fullName},</p>
            <p>Thank you for submitting your application.</p>
            <p><strong>Application ID:</strong> ${application_id}</p>
            <p>We have received your application details and will begin processing them shortly.
          You will be notified via your registered email address. Also keep checking our website for further updates/status.</p>
            <br>
            <p>Thanks & Regards,<br/>Admissions Team</p>
         `;

         try {
            await transporter.sendMail({
               from: '"Adoni Arts & Science College" <aasccollege@example.com>',
               to: userEmail,
               subject: full_subject,
               html: emailMessage
            });
         } catch (emailError) {
            console.error('Email failed:', emailError.message);
            // Optionally log this but don’t fail application
         }
      }

      return res.status(201).json({
         message: 'Application Submitted Successfully',
         application_id
      });

   } catch (error) {
      console.error('Server error:', error.stack || error.message);
      return res.status(500).json({ message: 'Internal Server Error: ' + error.message });
   }
};