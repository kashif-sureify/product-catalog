import pool from "../../config/db";
import { Product } from "../../models/productModel";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getTotalProducts,
  updateProduct,
} from "../../services/productService";

jest.mock("../../config/db", () => {
  return {
    query: jest.fn(),
    execute: jest.fn(),
  };
});

describe("Product Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProducts", () => {
    it("should return product with limit and offset", async () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Test 1",
          description: "test desc1",
          price: 50.55,
          stock: 6,
          image: "test1.jpg",
          created_at: new Date(),
        },
        {
          id: 2,
          name: "Test 2",
          description: "test desc2",
          price: 49.55,
          stock: 64,
          image: "test2.jpg",
          created_at: new Date(),
        },
      ];

      (pool.query as jest.Mock).mockResolvedValue([mockProducts]);

      const result = await getProducts(10, 0);
      const query =
        "SELECT * FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?";
      expect(pool.query).toHaveBeenCalledWith(query, [10, 0]);
      expect(result).toEqual(mockProducts);
    });

    it("should throw error on failure", async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error("DB Error"));

      await expect(getProducts(10, 0)).rejects.toThrow(
        "Failed to fetch all products"
      );
    });
  });

  describe("getTotalProducts", () => {
    it("should return total product count", async () => {
      (pool.query as jest.Mock).mockResolvedValue([[{ count: 5 }]]);

      const result = await getTotalProducts();
      const query = "SELECT COUNT(*) as count FROM products";
      expect(pool.query).toHaveBeenCalledWith(query);
      expect(result).toBe(5);
    });

    it("should throw error on failure", async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error("DB Error"));

      await expect(getTotalProducts).rejects.toThrow(
        "Failed to fetch product total count"
      );
    });
  });

  describe("getProductById", () => {
    it("should return product with limit and offset", async () => {
      const mockProduct = {
        id: 1,
        name: "Test 1",
        description: "test desc1",
        price: 50.55,
        stock: 6,
        image: "test1.jpg",
        created_at: new Date(),
      };

      (pool.query as jest.Mock).mockResolvedValue([[mockProduct]]);

      const result = await getProductById(1);
      const query = "SELECT * FROM products WHERE id = ? LIMIT 1";
      expect(pool.query).toHaveBeenCalledWith(query, [1]);
      expect(result).toEqual(mockProduct);
    });

    it("should return null if product not found", async () => {
      (pool.query as jest.Mock).mockResolvedValue([[]]);

      const result = await getProductById(999);
      const query = "SELECT * FROM products WHERE id = ? LIMIT 1";
      expect(pool.query).toHaveBeenCalledWith(query, [999]);
      expect(result).toBeNull();
    });

    it("should throw error on failure", async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error("DB Error"));

      await expect(getProductById(1)).rejects.toThrow(
        "Failed to fetch a product"
      );
    });
  });

  describe("createProduct", () => {
    it("should create and return new product", async () => {
      const mockProduct = {
        name: "Test 1",
        description: "test desc1",
        price: 50.55,
        stock: 6,
        image: "test1.jpg",
      };

      (pool.execute as jest.Mock).mockResolvedValue([{ insertId: 1 }]);
      (pool.query as jest.Mock).mockResolvedValue([
        [{ ...mockProduct, id: 1, created_at: new Date() }],
      ]);

      const result = await createProduct(mockProduct);
      expect(pool.execute).toHaveBeenCalled();
      expect(result?.name).toBe("Test 1");
    });

    it("should throw error if id is not inserted", async () => {
      const mockProduct = {
        name: "Test 1",
        description: "test desc1",
        price: 50.55,
        stock: 6,
        image: "test1.jpg",
      };
      (pool.execute as jest.Mock).mockResolvedValue([{}]);

      await expect(createProduct(mockProduct)).rejects.toThrow(
        "Failed to add new product"
      );
    });

    it("should throw error on failure", async () => {
      const mockProduct = {
        name: "Test 1",
        description: "test desc1",
        price: 50.55,
        stock: 6,
        image: "test1.jpg",
      };

      (pool.execute as jest.Mock).mockRejectedValue(new Error("DB Error"));

      await expect(createProduct(mockProduct)).rejects.toThrow(
        "Failed to add new product"
      );
    });
  });

  describe("updateProduct", () => {
    it("should update and return updated product", async () => {
      const mockProduct = {
        name: "Test 1",
        description: "test desc1",
        price: 50.55,
        stock: 6,
        image: "test1.jpg",
      };

      const updatedProductData = {
        name: "Updated",
      };
      (pool.execute as jest.Mock).mockResolvedValue([{ affectedRows: 1 }]);
      (pool.query as jest.Mock).mockResolvedValue([
        [{ ...mockProduct, id: 1, name: "Updated", created_at: new Date() }],
      ]);

      const result = await updateProduct(1, updatedProductData);
      expect(pool.execute).toHaveBeenCalled();
      expect(result?.name).toBe("Updated");
    });

    it("should return null if no rows get affected", async () => {
      (pool.execute as jest.Mock).mockResolvedValue([{ affectedRows: 0 }]);
      const result = await updateProduct(999, { name: "Non-existing product" });

      expect(result).toBeNull();
    });

    it("should throw error on failure", async () => {
      (pool.execute as jest.Mock).mockRejectedValue(new Error("DB Error"));

      await expect(updateProduct(999, { name: "non-existed" })).rejects.toThrow(
        "Failed to update a product"
      );
    });
  });

  describe("deleteProduct", () => {
    it("should return true if product delete", async () => {
      (pool.execute as jest.Mock).mockResolvedValue([{ affectedRows: 1 }]);

      const result = await deleteProduct(1);
      const query = "DELETE FROM products WHERE id = ?";
      expect(pool.execute).toHaveBeenCalledWith(query, [1]);
      expect(result).toBe(true);
    });

    it("should return false if no product not found", async () => {
      (pool.execute as jest.Mock).mockResolvedValue([{ affectedRows: 0 }]);
      const result = await deleteProduct(999);

      expect(result).toBe(false);
    });

    it("should throw error on failure", async () => {
      (pool.execute as jest.Mock).mockRejectedValue(new Error("DB Error"));

      await expect(deleteProduct(2)).rejects.toThrow(
        "Failed to delete a product"
      );
    });
  });
});
