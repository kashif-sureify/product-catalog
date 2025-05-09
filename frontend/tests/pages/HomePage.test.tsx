import HomePage from "../../src/pages/HomePage";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as useProductStoreModule from "../../src/store/useProductStore";
import * as useAuthStoreModule from "../../src/store/useAuthStore";
import React from "react";
import { Product } from "../../src/types/product";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalProducts: number | null;
}

vi.mock("../../src/components/ProductCard", () => {
  return {
    default: ({ product }: { product: Product }) => {
      return <div data-testid="product">{product.name}</div>;
    },
  };
});

vi.mock("../../src/components/Pagination", () => {
  const Pagination = ({
    currentPage,
    totalPages,
    totalProducts,
  }: PaginationProps) => {
    return (
      <div>
        <p data-testid="page-info">
          Showing {currentPage} to {totalPages} of {totalProducts} results
        </p>
        <button data-testid="prev-page" disabled={currentPage === 1}>
          Previous
        </button>
        <button data-testid="next-page" disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    );
  };
  return { default: Pagination };
});

vi.mock("../../src/components/AddProductModal", () => {
  return {
    default: () => {
      return <dialog id="addProductModal" />;
    },
  };
});

describe("HomePage Component", () => {
  const mockFetchProducts = vi.fn();
  const mockResetForm = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();

    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      products: [],
      page: 1,
      totalPages: 1,
      totalProducts: 0,
      loading: false,
      error: null,
      formData: {
        name: "",
        description: "",
        price: 0,
        stock: 0,
        image: "",
      },
      fetchProducts: mockFetchProducts,
      resetForm: mockResetForm,
      setFormData: vi.fn(),
      fetchProduct: vi.fn(),
      addProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
    });

    vi.spyOn(useAuthStoreModule, "useAuthStore").mockReturnValue({
      logout: mockLogout,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders empty state when no products are available", () => {
    render(<HomePage />);
    expect(screen.getByText("No products found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Get started by adding your first product to the inventory"
      )
    ).toBeInTheDocument();
  });

  test("calls fetchProducts on mount", () => {
    render(<HomePage />);
    expect(mockFetchProducts).toHaveBeenCalledWith(1, 6);
  });

  test("opens Add Product modal and resets form", async () => {
    const showModalSpy = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    render(<HomePage />);
    const btn = screen.getByText("Add Product");
    await userEvent.click(btn);
    expect(showModalSpy).toHaveBeenCalled();
    expect(mockResetForm).toHaveBeenCalled();
  });

  test("calls logout on logout button click", async () => {
    render(<HomePage />);
    await userEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
  });

  test("displays product cards if products exist", () => {
    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      ...useProductStoreModule.useProductStore(),
      products: [{ id: 1, name: "Product A" }],
      page: 1,
      totalPages: 1,
      totalProducts: 1,
      loading: false,
      error: null,
    });

    render(<HomePage />);
    expect(screen.getByTestId("product")).toHaveTextContent("Product A");
  });

  test("displays loading spinner when loading is true", () => {
    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      ...useProductStoreModule.useProductStore(),
      loading: true,
    });

    render(<HomePage />);
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  test("displays error message when error exists", () => {
    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      ...useProductStoreModule.useProductStore(),
      error: "Something went wrong",
    });

    render(<HomePage />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  test("renders pagination info when totalPages > 1", () => {
    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      ...useProductStoreModule.useProductStore(),
      products: [{ id: 1, name: "Product A" }],
      page: 2,
      totalPages: 3,
      totalProducts: 18,
      loading: false,
    });

    render(<HomePage />);
    expect(screen.getByTestId("page-info")).toHaveTextContent(
      "Showing 2 to 3 of 18 results"
    );
  });
});
