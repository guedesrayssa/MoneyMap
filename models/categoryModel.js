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
      'INSERT INTO categories (user_id, name, type, color, icon) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [data.user_id || '00000000-0000-0000-0000-000000000000', data.name, data.type, data.color, data.icon]
    );
    return result.rows[0];
  }
  static async update(id, data) {
    const result = await db.query(
      'UPDATE categories SET name = $1, type = $2, color = $3, icon = $4 WHERE id = $5 RETURNING *',
      [data.name, data.type, data.color, data.icon, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }
}

module.exports = Category;
