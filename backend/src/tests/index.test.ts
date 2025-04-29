// app.test.ts
import request from "supertest";
import app from "..";

jest.mock("../middlewares/authMiddleware", () => {
  return {
    protectRoute: jest.fn((req, res, next) => {
      return next();
    }), // Allowing the request to pass through
  };
});

describe("Express App", () => {
  it("should respond with a 200 status code for the /api/products route", async () => {
    const response = await request(app).get("/api/products");

    expect(response.status).toBe(200);
  });

  it("should respond with a 404 status code for an invalid route", async () => {
    const response = await request(app).get("/api/nonexistent-route");

    expect(response.status).toBe(404);
  });

  it("should respond with CORS headers", async () => {
    const response = await request(app).get("/api/products");

    expect(response.headers["access-control-allow-origin"]).toBe(
      process.env.CLIENT_ORIGIN
    );
  });
});
