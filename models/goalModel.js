const db = require('../config/database');

class Goal {
  static async getAll() {
    const result = await db.query('SELECT * FROM goals');
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM goals WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      `INSERT INTO goals (user_id, category_id, title, target_amount, current_amount, deadline) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.user_id, data.category_id, data.title, data.target_amount, data.current_amount, data.deadline]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await db.query(
      `UPDATE goals 
       SET title = $1, target_amount = $2, current_amount = $3, deadline = $4 
       WHERE id = $5 RETURNING *`,
      [data.title, data.target_amount, data.current_amount, data.deadline, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM goals WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }
}

module.exports = Goal;
