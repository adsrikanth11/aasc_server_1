const db = require('../../config/db');

const reg_form_table = 'student_reg_form';
const app_form_table = 'student_app_form';

// Student Registration
exports.Regsiter = async (data) => {
   try {
      const [result] = await db.query(`INSERT INTO ${reg_form_table} SET ?`, data);
      return result;
   } catch (error) {
      console.error(`[${reg_form_table}] create error:`, error.message);
      throw error;
   }
};

// Student Application Form
exports.Apply = async (data) => {
   try {
      const [result] = await db.query(`INSERT INTO ${app_form_table} SET ?`, data);
      return result;
   } catch (error) {
      console.error(`[${app_form_table}] create error:`, error.message);
      throw error;
   }
};

// Student Login
exports.Login = async (username) => {
   const sql = `SELECT * FROM ${reg_form_table} WHERE username = ?`;
   try {
      const [result] = await db.query(sql, [username]);
      return result[0] || null;
   } catch (error) {
      console.error(`[${reg_form_table}] Failed to fetch users with username ${username}:`, error);
      throw error;
   }
};