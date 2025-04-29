import * as productService from "../../services/productService";
import app from "../..";
import request from "supertest";

jest.mock("../../services/productService");
jest.mock("../../middlewares/authMiddleware", () => {
  return {
    protectRoute: jest.fn((req, res, next) => {
      return next();
    }), // Allowing the request to pass through
  };
});

describe("ProductController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET Products /", () => {
    it("should return paginated products", async () => {
      const mockProduct = [
        { id: 1, name: "Product A", price: 49.99, stock: 5 },
        {
          id: 2,
          name: "Product B",
          price: 59.99,
          stock: 5,
        },
      ];

      (productService.getProducts as jest.Mock).mockResolvedValue(mockProduct);
      (productService.getTotalProducts as jest.Mock).mockResolvedValue(2);

      const response = await request(app).get("/api/products?page=1&limit=6");

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(productService.getProducts).toHaveBeenCalledTimes(1);
      expect(productService.getTotalProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET Product /:id", () => {
    it("should return a product by id", async () => {
      const mockProduct = { id: 1, name: "Product A", price: 49.99, stock: 5 };
      (productService.getProductById as jest.Mock).mockResolvedValue(
        mockProduct
      );

      const response = await request(app).get("/api/products/1");

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(1);
      expect(productService.getProductById).toHaveBeenCalledTimes(1);
    });

    it("should return a 404 if id doesn't exist", async () => {
      (productService.getProductById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/api/products/9999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");
      expect(productService.getProductById).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST Product /", () => {
    it("should create a new product", async () => {
      const mockProduct = {
        id: 1,
        name: "Product A",
        description: "New product",
        price: 49.99,
        stock: 5,
        image: "image.jpg",
      };
      (productService.createProduct as jest.Mock).mockResolvedValue(
        mockProduct
      );

      const response = await request(app).post("/api/products/").send({
        name: "Product A",
        description: "New product",
        price: 49.99,
        stock: 5,
        image: "image.jpg",
      });

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe("Product A");
      expect(productService.createProduct).toHaveBeenCalledTimes(1);
    });

    it("should return 400 if missing fields", async () => {
      const response = await request(app)
        .post("/api/products/")
        .send({ name: "" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("All fields are required");
    });
  });

  describe("PATCH Product /:id", () => {
    it("should update a existing product", async () => {
      const mockProduct = {
        id: 1,
        name: "Updated product",
      };
      (productService.updateProduct as jest.Mock).mockResolvedValue(
        mockProduct
      );

      const response = await request(app).patch("/api/products/1").send({
        name: "Updated product",
      });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe("Updated product");
      expect(productService.updateProduct).toHaveBeenCalledTimes(1);
    });

    it("should return 404 if product not found", async () => {
      (productService.updateProduct as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .patch("/api/products/999")
        .send({ name: "Non-existing Product" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");
      expect(productService.updateProduct).toHaveBeenCalledTimes(1);
    });
  });

  describe("DELETE Product /:id", () => {
    it("should delete a product by id", async () => {
      (productService.deleteProduct as jest.Mock).mockResolvedValue(true);

      const response = await request(app).delete("/api/products/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Product deleted successfully");
      expect(productService.deleteProduct).toHaveBeenCalledTimes(1);
    });

    it("should return 404 if product not found", async () => {
      (productService.deleteProduct as jest.Mock).mockResolvedValue(false);

      const response = await request(app).delete("/api/products/999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");
      expect(productService.deleteProduct).toHaveBeenCalledTimes(1);
    });
  });
});
