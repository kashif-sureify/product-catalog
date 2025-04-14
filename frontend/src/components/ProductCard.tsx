import { Link, useNavigate } from "react-router-dom";
import { EditIcon, Trash2Icon } from "lucide-react";
import { Product } from "../types/product";
import { useProductStore } from "../store/useProductStore";

type ProductCardProps = {
  product: Product;
};



const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { deleteProduct } = useProductStore();

  const handleDelete = async () => {
    if (
      product.id &&
      window.confirm("Are you sure you want to delete this product ?")
    ) {
      await deleteProduct(Number(product.id));
      navigate("/");
    }
  };

  return (
    <div className="card bg-slate-600 text-primary-content w-90">
      <figure className="relative pt-[56.25%]">
        <img
          src={`/api/uploads/${product?.image}`}
          alt={product?.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </figure>
      <div className="card-body ">
        <h2 className="card-title">{product.name}</h2>
        <p>{product.description}</p>
        <p>$ {product.price}</p>
        <p>{product.stock}</p>

        <div className="card-actions justify-end">
          <Link
            to={`/product/${product.id}`}
            className="btn btn-sm btn-info btn-outline"
          >
            <EditIcon className="size-4" />
          </Link>
          <button
            className="btn btn-sm btn-error btn-outline"
            onClick={handleDelete}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
