import { Request, Response } from "express";
import uploadController from "../../controllers/uploadController";
import { Readable } from "stream";

describe("Upload Image", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;

  beforeEach(() => {
    json = jest.fn();
    res = { status: jest.fn().mockReturnValue({ json }) };
  });

  it("should return 200 if the file is uploaded", async () => {
    const filename = "test-image.jpg";

    const mockedFile = {
      fieldname: "file",
      originalname: filename,
      encoding: "7bit",
      mimetype: "image/jpeg",
      size: 12345,
      filename: filename,
      destination: "/uploads",
      path: "/uploads/test-image.jpg",
      buffer: Buffer.from("dummy"),
      stream: Readable.from(["dummy content"]),
    };

    req = { file: mockedFile };

    await uploadController.uploadImage(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ filename });
  });

  it("should return 400 if no file is uploaded", async () => {
    req = { file: undefined };

    await uploadController.uploadImage(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: "No file uploaded" });
  });
});
