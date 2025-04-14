import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";
import { Product } from "../models/productModel";

type ProductRow = Product & RowDataPacket;

// Fetch all products
export const getProducts = async (
  limit: number,
  offset: number
): Promise<Product[]> => {
  try {
    const [rows] = await pool.query<ProductRow[]>(
      "SELECT * FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return rows;
  } catch (error) {
    throw new Error("Failed to fetch all products");
  }
};

// Fetch all products
export const getTotalProducts = async (): Promise<number> => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM products");
    return (rows as any)[0].count;
  } catch (error) {
    throw new Error("Failed to fetch product total count");
  }
};

// Fetch a single product by ID
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const [rows] = await pool.query<ProductRow[]>(
      "SELECT * FROM products WHERE id = ? LIMIT 1",
      [id]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new Error("Failed to fetch a product");
  }
};

export const createProduct = async (
  productData: Omit<Product, "id" | "created_at">
): Promise<Product | null> => {
  const { name, description, price, stock, image } = productData;

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO products (name, description, price, stock, image) VALUES (?,?,?,?,?)",
      [name, description, price, stock, image ?? null]
    );
    const insertedId = result.insertId;
    if (!insertedId) {
      throw new Error("Failed to retrive insertId");
    }

    return await getProductById(insertedId);
  } catch (error) {
    throw new Error("Failed to add new product");
  }
};

export const updateProduct = async (
  id: number,
  productData: Partial<Omit<Product, "id" | "created_at"> & { image?: string }>
): Promise<Product | null> => {
  try {
    const {
      name = null,
      description = null,
      price = null,
      stock = null,
      image = null,
    } = productData;

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE products 
       SET 
         name = COALESCE(?, name), 
         description = COALESCE(?, description), 
         price = COALESCE(?, price), 
         stock = COALESCE(?, stock),
         image = COALESCE(?, image) 
       WHERE id = ?`,
      [name, description, price, stock, image, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return await getProductById(id);
  } catch (error) {
    throw new Error("Failed to update a product");
  }
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return false;
    }
    return true;
  } catch (error) {
    throw new Error("Failed to delete a product");
  }
};
