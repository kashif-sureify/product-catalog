import HomePage from "../../src/pages/HomePage";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as useProductStoreModule from "../../src/store/useProductStore";
import * as useAuthStoreModule from "../../src/store/useAuthStore";
import React from "react";
import { Product } from "../../src/types/product";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalProducts: number | null;
  onPageChange: (page: number) => void;
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
    onPageChange,
  }: PaginationProps) => {
    return (
      <div>
        <p data-testid="page-info">
          Showing {currentPage} to {totalPages} of {totalProducts} results
        </p>

        <button
          data-testid="prev-page"
          onClick={() => {
            return onPageChange(currentPage - 1);
          }}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <button
          data-testid="next-page"
          onClick={() => {
            return onPageChange(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
        >
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
    // Mock the showModal method on all dialog elements
    HTMLDialogElement.prototype.showModal = vi.fn();

    // You can also mock close() if needed
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

  test("render HomePage with no products and show empty state", () => {
    render(<HomePage />);
    const head = screen.getByText("No products found");
    const para = screen.getByText(
      "Get started by adding your first product to the inventory"
    );

    expect(head).toBeInTheDocument();
    expect(para).toBeInTheDocument();
  });

  test("call the fetchProduct on page load", () => {
    render(<HomePage />);
    expect(mockFetchProducts).toHaveBeenCalledWith(1, 6);
  });

  test("opens add product modal when button is clicked", async () => {
    render(<HomePage />);
    const showModalSpy = vi.spyOn(HTMLDialogElement.prototype, "showModal");

    const addProductBtn = screen.getAllByText("Add Product");

    await userEvent.click(addProductBtn[0]);

    expect(showModalSpy).toHaveBeenCalled();
    expect(mockResetForm).toHaveBeenCalled();
  });

  test("call the logout when logout button is clicked", async () => {
    render(<HomePage />);
    await userEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("render product when available", () => {
    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      ...useProductStoreModule.useProductStore(),
      products: [{ id: 1, name: "Product A" }],
    });

    render(<HomePage />);

    const productDiv = screen.getByTestId("product");

    expect(productDiv).toHaveTextContent("Product A");
  });

  it("render loading spinner when loading is true", () => {
    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      ...useProductStoreModule.useProductStore(),
      loading: true,
    });

    render(<HomePage />);

    const loader = screen.getByRole("img", { hidden: true });

    expect(loader).toBeInTheDocument();
  });

  it("render loading spinner when loading is true", () => {
    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      ...useProductStoreModule.useProductStore(),
      error: "Something went wrong",
    });

    render(<HomePage />);

    const error = screen.getByText("Something went wrong");

    expect(error).toBeInTheDocument();
  });

  it("changes when pagination button is clicked", async () => {
    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      ...useProductStoreModule.useProductStore(),
      products: [{ id: 1, name: "Product A" }],
      currentPage: 1,
      totalPages: 3,
      totalProducts: 15,
    });

    render(<HomePage />);

    // const pageInfo = screen.getByTestId("page-info");
    // expect(pageInfo).toHaveTextContent("Showing 2 to 3 of 15 results");
    expect(screen.getByTestId("page-info")).toHaveTextContent(
      "Showing 1 to 3 of 15 results"
    );

    const prev = screen.getByTestId("prev-page");
    const next = screen.getByTestId("next-page");

    await userEvent.click(prev);
    await userEvent.click(next);
    await waitFor(() => {
      expect(mockFetchProducts).toHaveBeenCalledWith(1, 6);
    });
  });
});
