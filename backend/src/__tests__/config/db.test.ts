import dotenv from "dotenv";
import * as mysql from "mysql2/promise";

jest.mock("mysql2/promise", () => {
  return {
    createPool: jest.fn().mockReturnValue({
      query: jest.fn(),
      getConnection: jest.fn(),
      end: jest.fn(),
    }),
  };
});

dotenv.config();

describe("MySQL Pool Initialization", () => {
  it("should create a pool with the correct config", async () => {
    const { default: pool } = await import("../../config/db");

    expect(mysql.createPool).toHaveBeenCalledWith({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    expect(pool).toHaveProperty("getConnection");
    expect(pool).toHaveProperty("query");
    expect(pool).toHaveProperty("end");
  });
});
