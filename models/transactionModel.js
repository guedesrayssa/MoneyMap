const db = require('../config/database');

class Transaction {
  static async getAll() {
    const result = await db.query('SELECT * FROM transactions');
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM transactions WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      `INSERT INTO transactions (user_id, category_id, title, amount, date, description) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.user_id, data.category_id, data.title, data.amount, data.date, data.description]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await db.query(
      `UPDATE transactions 
       SET title = $1, amount = $2, date = $3, description = $4 
       WHERE id = $5 RETURNING *`,
      [data.title, data.amount, data.date, data.description, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }
}

module.exports = Transaction;
