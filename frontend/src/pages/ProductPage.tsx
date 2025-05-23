import { Loader, SaveIcon, Trash2Icon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";

function ProductPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    formData,
    fetchProduct,
    setFormData,
    updateProduct,
    deleteProduct,
    handleUpload,
    handleFileChange,
    file,
    message,
    uploading,
    loading,
    error,
  } = useProductStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

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

  const confirmDelete = async () => {
    if (id) {
      await deleteProduct(Number(id));
      setIsConfirmOpen(false);
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl justify-items-center">
      <button
        type="button"
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
              <label className="label" htmlFor="product-name">
                <span className="label-text text-base font-medium my-1">
                  Product Name
                </span>
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
              </label>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="product-description">
                <span className="label-text text-base font-medium my-1">
                  Product Description
                </span>
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
              </label>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="product-price">
                <span className="label-text text-base font-medium my-1">
                  Price
                </span>
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
              </label>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="product-stock">
                <span className="label-text text-base font-medium my-1">
                  Stock
                </span>
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
              </label>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="product-image">
                <span className="label-text text-base font-medium my-1">
                  Change Image
                </span>
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
              </label>

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
                onClick={() => setIsConfirmOpen(true)}
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
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => setIsConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-sm btn-error"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
