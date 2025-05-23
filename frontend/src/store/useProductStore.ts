import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import type { ChangeEvent } from "react";
import type { Product } from "../types/product";

interface ProductStore {
  products: Product[];
  page: number;
  setPage: (page: number) => void;

  totalPages: number;
  totalProducts: number | null;
  loading: boolean;
  error: string | null;

  file: File | null;
  message: String;
  uploading: boolean;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => Promise<void>;

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
  file: null,
  message: "",
  uploading: false,
  formData: {
    name: "",
    description: "",
    price: null,
    stock: null,
    image: "",
  },
  setPage: (page) => set({ page }),
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
  handleFileChange: (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      set({ file });
    }
  },
  handleUpload: async () => {
    const { file, formData, setFormData } = get();
    if (file) {
      const uploadData = new FormData();
      uploadData.append("image", file);

      set({ uploading: true, message: "Uploading..." });
      try {
        const res = await axios.post("/api/upload", uploadData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / (event.total || 1),
            );
            set({ message: `Uploading......${percent} %` });
          },
        });

        setFormData({ ...formData, image: res.data.filename });
        set({ message: "Image uploaded", file: null });
        toast.success("Image uploaded successfully!");
        (
          document.querySelector("input[type='file']") as HTMLInputElement
        ).value = "";
      } catch (error) {
        set({ message: "Upload Failed" });
        toast.error("Image uploaded failed");
      } finally {
        set({ uploading: false });
      }
    }
  },

  fetchProducts: async (currentPage, limit) => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `/api/products?page=${currentPage}&limit=${limit}`,
      );
      set({
        products: response.data.data,
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalProducts: response.data.totalProducts,
        error: null,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Failed to fetch products",
        });
      } else {
        set({ error: "Unexpected error occurred" });
      }
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
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Failed to a fetch product",
        });
      } else {
        set({ error: "Unexpected error occurred" });
      }
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });
    try {
      const { formData } = get();
      await axios.post("/api/products", formData);
      await get().fetchProducts(1, 6);
      get().resetForm();

      toast.success("Product added Successfully !");

      const modal = document.getElementById(
        "addProductModal",
      ) as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Failed to add a product",
        });
        toast.error("Something went wrong");
      } else {
        set({ error: "Unexpected error occurred" });
        toast.error("Something went wrong");
      }
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
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Failed to update a product",
        });
        toast.error("Something went wrong");
      } else {
        set({ error: "Unexpected error occurred" });
        toast.error("Something went wrong");
      }
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
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Failed to delete a product",
        });
        toast.error("Something went wrong");
      } else {
        set({ error: "Unexpected error occurred" });
        toast.error("Something went wrong");
      }
    } finally {
      set({ loading: false });
    }
  },
}));
