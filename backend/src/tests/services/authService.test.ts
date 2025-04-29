import pool from "../../config/db";
import { login, signup } from "../../services/authService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../../config/db", () => {
  return {
    query: jest.fn(),
  };
});

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Service", () => {
  const mockUser = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    password: "hashedPassword",
  };

  beforeEach(() => {
    return jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should signup a user and return a token and user", async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (pool.query as jest.Mock)
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce([[mockUser]]);

      (jwt.sign as jest.Mock).mockReturnValue("mockToken");
      const result = await signup(
        "testuser",
        "test@example.com",
        "password123"
      );

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          email: mockUser.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      expect(result).toEqual({ token: "mockToken", user: mockUser });
    });

    it("should return null if user not found after signup", async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (pool.query as jest.Mock)
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce([[]]);

      const result = await signup(
        "testuser",
        "test@example.com",
        "password123"
      );

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledTimes(2);
    });
  });

  describe("login", () => {
    it("should login a user and return a token and user", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce([[mockUser]]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      (jwt.sign as jest.Mock).mockReturnValue("mockToken");
      const result = await login(mockUser.email, "password123");

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE email=?",
        [mockUser.email]
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        mockUser.password
      );
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          email: mockUser.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      expect(result).toEqual({ token: "mockToken", user: mockUser });
    });

    it("should return null if user not found after login", async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (pool.query as jest.Mock).mockResolvedValueOnce([[]]);

      const result = await login("notfoundemail@example.com", "password123");

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledTimes(1);
    });
  });
});
