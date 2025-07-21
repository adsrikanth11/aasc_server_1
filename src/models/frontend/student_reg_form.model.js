const db = require('../../config/db');

const TABLE = 'student_app_form';

exports.Regsiter = async (data) => {
   try {
      const [result] = await db.query(`INSERT INTO ${TABLE} SET ?`, data);
      return result;
   } catch (error) {
      console.error(`[${TABLE}] create error:`, error.message);
      throw error;
   }
};