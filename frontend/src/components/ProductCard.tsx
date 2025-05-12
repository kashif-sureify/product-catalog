import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EditIcon, Trash2Icon } from "lucide-react";
import type { Product } from "../types/product";
import { useProductStore } from "../store/useProductStore";

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { deleteProduct } = useProductStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  const handleDeleteConfirm = async () => {
    if (product.id) {
      await deleteProduct(Number(product.id));
      setIsConfirmOpen(false);
      navigate("/");
    }
  };

  return (
    <div className="card bg-slate-600 text-primary-content w-90 relative">
      <figure className="relative pt-[56.25%]">
        <img
          src={`/api/uploads/${product?.image}`}
          alt={product?.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        <p>{product.description}</p>
        <p>${product.price}</p>
        <p>{product.stock}</p>

        <div className="card-actions justify-end">
          <Link
            to={`/product/${product.id}`}
            className="btn btn-sm btn-info btn-outline"
          >
            <EditIcon className="size-4" />
          </Link>
          <button
            type="button"
            className="btn btn-sm btn-error btn-outline"
            aria-label="delete-product"
            onClick={() => setIsConfirmOpen(true)}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>

      {isConfirmOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg space-y-4">
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
                onClick={handleDeleteConfirm}
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

export default ProductCard;
