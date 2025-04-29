import { productDB } from "../config/productDB";
import { userDB } from "../config/userDB";
import { startServer } from "../server";
import app from "../index";

jest.mock("../config/productDB", () => {
  return {
    productDB: jest.fn(),
  };
});

jest.mock("../config/userDB", () => {
  return {
    userDB: jest.fn(),
  };
});

jest.mock("../index", () => {
  return {
    listen: jest.fn(),
  };
});

describe("startServer", () => {
  it("should coonect the database and start the server", async () => {
    const mockProductDB = productDB as jest.Mock;
    const mockUserDB = userDB as jest.Mock;
    const mockListen = app.listen as jest.Mock;

    mockProductDB.mockResolvedValue(undefined);
    mockUserDB.mockResolvedValue(undefined);

    await startServer();

    expect(mockProductDB).toHaveBeenCalledTimes(1);
    expect(mockUserDB).toHaveBeenCalledTimes(1);
    expect(mockListen).toHaveBeenCalledTimes(1);
    expect(mockListen).toHaveBeenCalledWith(expect.any(Number));
  });
});
