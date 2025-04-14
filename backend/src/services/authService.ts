import bcrypt from "bcrypt";
import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (
  username: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword]
  );

  // Fetch newly created user
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) return null;

  const user = rows[0];

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return { token, user };
};

export const login = async (email: string, password: string) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM users WHERE email=?`,
    [email]
  );

  if (rows.length === 0) return null;
  const user = rows[0];

  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) return null;

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );

  return { token, user };
};
