
const pool = require('../config/database');

const getAllGoals = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.*, c.name as category_name 
      FROM goals g 
      LEFT JOIN categories c ON g.category_id = c.id
      ORDER BY g.month ASC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error in getAllGoals:', err);
    res.status(500).json({ error: 'Internal server error while fetching goals' });
  }
};

const createGoal = async (req, res) => {
  const { category_id, month, limit_amount } = req.body;
  const user_id = '00000000-0000-0000-0000-000000000000'; // ID padrão para aplicação sem autenticação

  try {
    const result = await pool.query(
      `INSERT INTO goals (user_id, category_id, month, limit_amount)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, category_id, month, limit_amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar meta:', err);
    res.status(500).json({ error: err.message });
  }
};

const updateGoal = async (req, res) => {
  const { id } = req.params;
  const { month, limit_amount } = req.body;
  try {
    const result = await pool.query(
      `UPDATE goals SET month = $1, limit_amount = $2 WHERE id = $3 RETURNING *`,
      [month, limit_amount, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteGoal = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM goals WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllGoals,
  createGoal,
  updateGoal,
  deleteGoal
};