import { Request, Response } from "express";

const uploadImage = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  res.status(200).json({ filename: req.file.filename });
};

export default {
  uploadImage,
};
