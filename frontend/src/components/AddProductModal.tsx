import { PlusCircleIcon } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import React, { ChangeEvent, useState } from "react";
import axios from "axios";

const AddProductModal = () => {
  const { formData, setFormData, addProduct, loading } = useProductStore();
  const [file, setFile] = useState<File | null>(null);

  const [message, setMessage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setUploading(true);
      setMessage("Uploading...");

      const res = await axios.post("/api/upload/", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / (event.total || 1));
          setMessage(`Uploading....${percent} %`);
        },
      });

      setFormData({ ...formData, image: res.data.filename });
      setMessage("Image Uploaded");

      setFile(null);
      (document.querySelector("input[type='file']") as HTMLInputElement).value =
        "";
    } catch {
      setMessage("Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(e);
  };

  return (
    <dialog id="addProductModal" className="modal">
      <div className="modal-box">
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => {
            return (
              document.getElementById("addProductModal") as HTMLDialogElement
            )?.close();
          }}
        >
          ✕
        </button>
        <h3 className="font-bold text-xl mb-8">Add New Product</h3>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label" htmlFor="product-name">
              <span className="label-text text-base font-medium my-1">
                Product Name
              </span>
            </label>
            <input
              id="product-name"
              type="text"
              placeholder="Enter product name"
              className="input input-bordered w-full my-1"
              value={formData.name}
              onChange={(e) => {
                return setFormData({ ...formData, name: e.target.value });
              }}
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="product-description">
              <span className="label-text text-base font-medium my-1">
                Product Description
              </span>
            </label>
            <input
              id="product-description"
              type="text"
              placeholder="Enter product description"
              className="input input-bordered w-full my-1"
              value={formData.description}
              onChange={(e) => {
                return setFormData({
                  ...formData,
                  description: e.target.value,
                });
              }}
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="product-price">
              <span className="label-text text-base font-medium my-1">
                Price
              </span>
            </label>
            <input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="$ 0.00"
              className="input input-bordered w-full my-1"
              value={formData.price ?? ""}
              onChange={(e) => {
                return setFormData({
                  ...formData,
                  price: Number(e.target.value),
                });
              }}
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="product-stock">
              <span className="label-text text-base font-medium my-1">
                Stock
              </span>
            </label>
            <input
              id="product-stock"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              className="input input-bordered w-full my-1"
              value={formData.stock ?? ""}
              onChange={(e) => {
                return setFormData({
                  ...formData,
                  stock: Number(e.target.value),
                });
              }}
            />
          </div>

          <div className="form-control">
            <label htmlFor="img-upload" className="label">
              <span className="label-text text-base font-medium my-1">
                Upload Image
              </span>
            </label>
            <div className="flex items-center gap-4">
              <input
                id="img-upload"
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={handleFileChange}
                disabled={uploading}
              />

              <button
                type="button"
                className="btn btn-primary whitespace-nowrap"
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {message && (
              <span role="status" className="text-sm text-info mt-2">
                {message}
              </span>
            )}
          </div>

          {formData.image && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-1">Current Image:</p>
              <img
                src={`/api/uploads/${formData.image}`}
                alt="Product"
                className="h-32 object-cover rounded border"
              />
            </div>
          )}

          <div className="modal-action flex justify-between mt-8">
            <button
              type="button"
              className="btn btn-error"
              onClick={() => {
                return (
                  document.getElementById(
                    "addProductModal"
                  ) as HTMLDialogElement
                )?.close();
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                !formData.name ||
                !formData.description ||
                !formData.price ||
                !formData.stock
              }
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <PlusCircleIcon className="size-5 mr-2" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default AddProductModal;
