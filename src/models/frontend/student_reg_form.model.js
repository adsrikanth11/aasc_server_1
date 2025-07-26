const db = require('../../config/db.congfig');

const students = 'students';
const student_app_form = 'student_app_form';

// Register a new student
exports.Register_Student = async (data) => {
   try {
      const [result] = await db.query(`INSERT INTO students SET ?`, data);
      return result;
   } catch (error) {
      console.error(`[${students}] create error:`, error.message);
      throw error;
   }
};

// Student Login
exports.Student_Login = async (username) => {
   try {
      const [result] = await db.query(`SELECT * FROM students WHERE username = ?`, [username]);
      return result[0] || null;
   } catch (error) {
      console.error(`[${students}] Failed to fetch users with username ${username}:`, error);
      throw error;
   }
};

// Verify Email
exports.Verif_Email = async (userId) => {
   try {
      const [result] = await db.query(`UPDATE students SET is_verified = ? WHERE id = ?`, [1, userId]);
      return result;
   } catch (error) {
      console.error(`[${students}] create error:`, error.message);
      throw error;
   }
};

// Student Application Form
exports.Application_Form = async (data) => {
   try {
      const [result] = await db.query(`INSERT INTO ${student_app_form} SET ?`, data);
      return result;
   } catch (error) {
      console.error(`[${student_app_form}] create error:`, error.message);
      throw error;
   }
};