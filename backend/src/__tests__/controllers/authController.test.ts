import * as authService from "../../services/authService";
import app from "../../index";
import request from "supertest";
import { Request, Response, NextFunction } from "express";

jest.mock("../../services/authService");
jest.mock("../../middleware/authMiddleware", () => {
  return {
    protectRoute: (
      req: Request & { user?: { id: number; username: string } },
      res: Response,
      next: NextFunction
    ) => {
      req.user = { id: 1, username: "testuser" };
      return next();
    },
  };
});

describe("AuthController", () => {
  describe("POST /signup", () => {
    it("should return 400 if fields are missing", async () => {
      const response = await request(app)
        .post("/api/v1/auth/signup")
        .send({ username: "", email: "", password: "" });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("All fields are required");
    });

    it("should return 201 and user data on successful signup", async () => {
      const mockSignupResult = {
        token: "mockToken",
        user: { username: "testuser", email: "test@example.com" },
      };

      (authService.signup as jest.Mock).mockResolvedValue(mockSignupResult);
      const response = await request(app).post("/api/v1/auth/signup").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user.username).toBe("testuser");
    });

    it("should return 401 if signup fails", async () => {
      (authService.signup as jest.Mock).mockResolvedValue(null);
      const response = await request(app).post("/api/v1/auth/signup").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Signup failed");
    });
  });

  describe("POST /login", () => {
    it("should return 400 if fields are missing", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "", password: "" });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("All fields are required !");
    });

    it("should return 200 and user data on successful login", async () => {
      const mockLoginResult = {
        token: "mockToken",
        user: { username: "testuser", email: "test@example.com" },
      };

      (authService.login as jest.Mock).mockResolvedValue(mockLoginResult);
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.username).toBe("testuser");
    });

    it("should return 401 if login fails", async () => {
      (authService.login as jest.Mock).mockResolvedValue(null);
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "wrongPassword",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid Credentials");
    });
  });

  describe("POST /logout", () => {
    it("should return 200 on successful logout", async () => {
      const response = await request(app).post("/api/v1/auth/logout");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Logout successfully !");
    });
  });

  describe("GET /authCheck", () => {
    it("should return authenticated user data", async () => {
      const res = await request(app).get("/api/v1/auth/authCheck");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        status: 200,
        success: true,
        user: {
          id: 1,
          username: "testuser",
        },
      });
    });
  });
});
