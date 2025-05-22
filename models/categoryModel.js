const db = require('../config/database');

class Category {
  static async getAll() {
    const result = await db.query('SELECT * FROM categories');
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO categories (user_id, name, type) VALUES ($1, $2, $3) RETURNING *',
      [data.user_id, data.name, data.type]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await db.query(
      'UPDATE categories SET name = $1, type = $2 WHERE id = $3 RETURNING *',
      [data.name, data.type, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }
}

module.exports = Category;
