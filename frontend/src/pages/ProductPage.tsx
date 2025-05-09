import { Loader, SaveIcon, Trash2Icon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";

const ProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    formData,
    fetchProduct,
    setFormData,
    updateProduct,
    deleteProduct,
    loading,
    error,
  } = useProductStore();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchProduct(Number(id));
    }
  }, [fetchProduct, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader role="img" className="animate-ping text-red-600 size-10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please upload a file!");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setUploading(true);
      setMessage("Uploading...");

      const res = await axios.post("/api/upload/", uploadData, {
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

  const handleDelete = async () => {
    if (
      id &&
      window.confirm("Are you sure you want to delete this product ?")
    ) {
      await deleteProduct(Number(id));
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl justify-items-center">
      <button
        onClick={() => {
          return navigate("/");
        }}
        className="btn btn-success btn-outline mb-8 absolute"
      >
        Back to Product
      </button>

      <div className="card bg-slate-500 text-primary-content w-1/2 mt-20 bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Edit Product</h2>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (id) {
                updateProduct(Number(id));
              }
            }}
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium my-1">
                  Product Name
                </span>
              </label>
              <input
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
              <label className="label">
                <span className="label-text text-base font-medium my-1">
                  Product Description
                </span>
              </label>
              <input
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
              <label className="label">
                <span className="label-text text-base font-medium my-1">
                  Price
                </span>
              </label>
              <input
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
              <label className="label">
                <span className="label-text text-base font-medium my-1">
                  Stock
                </span>
              </label>
              <input
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
              <label className="label" htmlFor="product-image">
                <span className="label-text text-base font-medium my-1">
                  Change Image
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="product-image"
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
                <span className="text-sm text-info mt-2">{message}</span>
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

            <div className="flex justify-between mt-8">
              <button
                type="button"
                className="btn btn-error"
                onClick={handleDelete}
              >
                <Trash2Icon className="size-4 mr-2" />
                Delete Product
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => {
                  return navigate("/");
                }}
              >
                {loading ? (
                  <span
                    role="img"
                    className="loading loading-spinner loading-sm"
                  />
                ) : (
                  <>
                    <SaveIcon className="size-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
