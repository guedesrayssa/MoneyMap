
const pool = require('../config/database');

const getAllGoals = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.*, c.name as category_name 
      FROM goals g 
      LEFT JOIN categories c ON g.category_id = c.id
      ORDER BY g.deadline ASC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error in getAllGoals:', err);
    res.status(500).json({ error: 'Internal server error while fetching goals' });
  }
};

const createGoal = async (req, res) => {
  const { user_id, category_id, title, target_amount, current_amount, deadline } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO goals (user_id, category_id, title, target_amount, current_amount, deadline)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, category_id, title, target_amount, current_amount, deadline]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateGoal = async (req, res) => {
  const { id } = req.params;
  const { title, target_amount, current_amount, deadline } = req.body;
  try {
    const result = await pool.query(
      `UPDATE goals SET title = $1, target_amount = $2, current_amount = $3, deadline = $4 WHERE id = $5 RETURNING *`,
      [title, target_amount, current_amount, deadline, id]
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