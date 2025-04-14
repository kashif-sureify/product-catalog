import { create } from "zustand";
import { Product } from "../types/product";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

interface ProductStore {
  products: Product[];
  page: number;
  totalPages: number;
  totalProducts: number | null;
  loading: boolean;
  error: string | null;

  formData: Omit<Product, "id" | "created_at">;
  setFormData: (formData: ProductStore["formData"]) => void;
  resetForm: () => void;

  fetchProducts: (currentPage: number, limit: number) => Promise<void>;
  fetchProduct: (id: number) => Promise<void>;
  addProduct: (e: React.FormEvent) => Promise<void>;
  updateProduct: (id: number) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  page: 1,
  totalPages: 1,
  totalProducts: null,
  loading: false,
  error: null,
  formData: {
    name: "",
    description: "",
    price: null,
    stock: null,
    image: "",
  },
  setFormData: (formData) => set({ formData }),
  resetForm: () =>
    set({
      formData: {
        name: "",
        description: "",
        price: 0.0,
        stock: 0,
        image: "",
      },
    }),

  fetchProducts: async (currentPage, limit) => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `/api/products?page=${currentPage}&limit=${limit}`
      );
      set({
        products: response.data.data,
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalProducts: response.data.totalProducts,
        error: null,
      });
    } catch (error) {
      set({ error: "Failed to fetch products" });
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id: number) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/api/products/${id}`);
      set({ formData: response.data.data, error: null });
    } catch (error) {
      set({ error: "Failed to fetch a product" });
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });
    try {
      const { formData } = get();
      await axios.post(`/api/products`, formData);
      await get().fetchProducts(1, 6);
      get().resetForm();

      toast.success("Product added Successfully !");

      const modal = document.getElementById(
        "addProductModal"
      ) as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
    } catch (error) {
      set({ error: "Failed to add a product" });
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id: number) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const response = await axios.patch(`/api/products/${id}`, formData);
      set({ formData: response.data.data, error: null });
      toast.success("Product updated Successfully !");
    } catch (error) {
      set({ error: "Failed to update a product" });
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id: number) => {
    set({ loading: true });
    try {
      await axios.delete(`/api/products/${id}`);
      set((prev) => ({
        products: prev.products.filter((product) => product.id !== id),
      }));
      toast.success("Product deleted Successfully !");
    } catch (error) {
      set({ error: "Failed to delete a product" });
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
}));
