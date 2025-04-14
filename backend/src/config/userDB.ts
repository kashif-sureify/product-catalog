import pool from "./db";

export const userDB = async () => {
  const userTable = `
    CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const connection = await pool.getConnection();
    await connection.execute(userTable);
    connection.release();
  } catch (error) {
    throw new Error("Failed to initialize user table");
  }
};

userDB();
