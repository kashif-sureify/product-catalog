import pool from "./db";

export const productDB = async () => {
  const productTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      stock INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const connection = await pool.getConnection();
    await connection.execute(productTable);
    connection.release();
  } catch {
    throw new Error("Failed to initialize product table");
  }
};

productDB();
