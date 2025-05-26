const db = require('../config/database');

class User {
  static async getAll() {
    const result = await db.query('SELECT * FROM users');
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
   
    const passwordValue = data.password_ || data.password;
    const result = await db.query(
      'INSERT INTO users (name, email, password_) VALUES ($1, $2, $3) RETURNING *',
      [data.name, data.email, passwordValue]
    );
    return result.rows[0];
  }

  static async update(id, data) {

    let query, params;
    if (data.password_ || data.password) {
      const passwordValue = data.password_ || data.password;
      query = 'UPDATE users SET name = $1, email = $2, password_ = $3 WHERE id = $4 RETURNING *';
      params = [data.name, data.email, passwordValue, id];
    } else {
      query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *';
      params = [data.name, data.email, id];
    }
    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }
}


// Funções controladoras
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    // Garante que password_ seja passado para o model
    const userData = { ...req.body };
    if (userData.password) {
      userData.password_ = userData.password;
      delete userData.password;
    }
    const newUser = await User.create(userData);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.update(req.params.id, req.body);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await User.delete(req.params.id);
    if (deleted) {
      res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
