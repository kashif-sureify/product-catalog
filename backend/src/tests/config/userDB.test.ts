import pool from "../../config/db";
import { userDB } from "../../config/userDB";

type MockConnection = {
  execute: jest.Mock<Promise<void>, [string]>;
  release: jest.Mock<void, []>;
};

jest.mock("../../config/db", () => {
  const execute = jest.fn<Promise<void>, [string]>();
  const release = jest.fn<void, []>();

  const getConnection = jest
    .fn<Promise<MockConnection>, []>()
    .mockResolvedValue({
      execute,
      release,
    });

  return {
    __esModule: true,
    default: { getConnection },
  };
});

describe("userDB", () => {
  it("should create users table successfully", async () => {
    await expect(userDB()).resolves.toBeUndefined();

    const mockedPool = pool as unknown as {
      getConnection: jest.Mock<Promise<MockConnection>, []>;
    };

    expect(mockedPool.getConnection).toHaveBeenCalled();

    const connection = await mockedPool.getConnection.mock.results[0].value;
    const query = "CREATE TABLE IF NOT EXISTS users";
    expect(connection.execute).toHaveBeenCalledWith(
      expect.stringContaining(query)
    );
    expect(connection.release).toHaveBeenCalled();
  });

  it("should throw error if connection fails", async () => {
    const mockedPool = pool as unknown as {
      getConnection: jest.Mock<Promise<MockConnection>, []>;
    };

    mockedPool.getConnection.mockRejectedValueOnce(new Error("DB Error"));

    await expect(userDB()).rejects.toThrow(
      "Failed to initialize user table"
    );
  });
});
