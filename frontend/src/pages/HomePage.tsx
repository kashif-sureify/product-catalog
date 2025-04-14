import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useProductStore } from "../store/useProductStore";
import AddProductModal from "../components/AddProductModal";
import { useAuthStore } from "../store/useAuthStore";
import { Loader, PackageIcon } from "lucide-react";
import Pagination from "../components/Pagination";

const HomePage = () => {
  const {
    products,
    loading,
    error,
    totalPages,
    totalProducts,
    resetForm,
    fetchProducts,
  } = useProductStore();
  const { logout } = useAuthStore();

  const [page, setPage] = useState<number>(1);
  const limit: number = 6;

  useEffect(() => {
    fetchProducts(page, limit);
  }, [page, limit]);

  const openAddProductModal = () => {
    const modal = document.getElementById(
      "addProductModal"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
      resetForm();
    }
  };

  return (
    <main className="mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <button className="btn btn-primary" onClick={openAddProductModal}>
          Add Product
        </button>

        <button className="btn btn-error" onClick={logout}>
          Logout
        </button>
      </div>

      <AddProductModal />

      {error && <div className="alert alert-error mb-8">{error}</div>}
      {products.length === 0 && !loading && (
        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <div className="bg-base-100 rounded-full p-6">
            <PackageIcon className="size-12" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">No products found</h3>
            <p className="text-gray-500 max-w-sm">
              Get started by adding your first product to the inventory
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader className="animate-ping text-red-600 size-10" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalProducts={totalProducts}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default HomePage;
