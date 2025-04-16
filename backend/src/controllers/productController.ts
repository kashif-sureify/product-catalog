import * as productService from "../services/productService";
import { Request, Response } from "express";
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const offset = (page - 1) * limit;

    const products = await productService.getProducts(limit, offset);
    const total = await productService.getTotalProducts();
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: 200,
      success: true,
      page,
      limit,
      totalProducts: total,
      totalPages,
      data: products,
    });
    return;
  } catch {
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal Server Error" });
    throw new Error("Something went wrong in update product controller");
  }
};

export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const product = await productService.getProductById(Number(id));

    if (product) {
      res.status(200).json({ status: 200, success: true, data: product });
      return;
    }
    res
      .status(404)
      .json({ status: 404, success: false, message: "Product not found" });

    return;
  } catch {
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, price, stock, image } = req.body;

  if (!name || !description || !price || !stock || !image) {
    res.status(400).json({
      status: 400,
      success: false,
      message: "All fields are required",
    });
    return;
  }

  try {
    const newProduct = await productService.createProduct({
      name,
      description,
      price,
      stock,
      image,
    });
    res.status(201).json({ status: 201, success: true, data: newProduct });
  } catch {
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const updatedProduct = await productService.updateProduct(
      Number(id),
      req.body
    );

    if (updatedProduct) {
      res
        .status(200)
        .json({ status: 200, success: true, data: updatedProduct });
      return;
    }
    res
      .status(404)
      .json({ status: 404, success: false, message: "Product not found" });

    return;
  } catch {
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const deleted = await productService.deleteProduct(Number(id));

    if (deleted) {
      res.status(200).json({
        status: 200,
        success: true,
        message: "Product deleted successfully",
      });
      return;
    }
    res
      .status(404)
      .json({ status: 404, success: false, message: "Product not found" });

    return;
  } catch {
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};
