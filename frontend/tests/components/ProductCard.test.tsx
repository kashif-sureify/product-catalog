import { render, screen } from "@testing-library/react";
import * as React from "react";
import { vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Product } from "../../src/types/product";
import ProductCard from "../../src/components/ProductCard";
import * as useProductStoreModule from "../../src/store/useProductStore";

interface UseProductStoreReturn {
  deleteProduct: () => Promise<void>;
}
const mockNavigate = vi.fn();

const mockProduct: Product = {
  id: 1,
  name: "Test Product",
  description: "This is a test product",
  price: 99.99,
  stock: 10,
  image: "test-image.jpg",
  created_at: new Date(),
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (ui: React.ReactElement, initialEnteries = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEnteries}>
      <Routes>
        <Route path="/" element={ui} />
        <Route path="/product/:id" element={<div>Product Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("ProductCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders product details correctly", () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    const productName = screen.getByText("Test Product");
    const productDesc = screen.getByText("This is a test product");
    const productPrice = screen.getByText("$99.99");
    const productStock = screen.getByText("10");
    const productImg = screen.getByAltText("Test Product");

    expect(productName).toBeInTheDocument();
    expect(productDesc).toBeInTheDocument();
    expect(productPrice).toBeInTheDocument();
    expect(productStock).toBeInTheDocument();
    expect(productImg).toHaveAttribute("src", "/api/uploads/test-image.jpg");
  });

  it("calls deleteProduct and navigates after confirmation", async () => {
    const mockDeleteProduct: UseProductStoreReturn["deleteProduct"] = vi
      .fn()
      .mockResolvedValue(undefined);
    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      deleteProduct: mockDeleteProduct,
    } as UseProductStoreReturn);

    renderWithRouter(<ProductCard product={mockProduct} />);

    await userEvent.click(
      screen.getByRole("button", { name: /delete-product/i }),
    );
    expect(
      screen.getByText("Are you sure you want to delete this product?"),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(mockDeleteProduct).toHaveBeenCalledWith(mockProduct.id);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("does not delete product if confirm is false", async () => {
    const mockDeleteProduct: UseProductStoreReturn["deleteProduct"] = vi
      .fn()
      .mockResolvedValue(undefined);
    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      deleteProduct: mockDeleteProduct,
    } as UseProductStoreReturn);

    vi.spyOn(window, "confirm").mockReturnValueOnce(false);

    renderWithRouter(<ProductCard product={mockProduct} />);
    const deleteIcon = screen.getByRole("button", { name: /delete-product/i });
    expect(deleteIcon).toBeInTheDocument();
    await userEvent.click(deleteIcon);

    expect(mockDeleteProduct).not.toHaveBeenCalled();
  });

  it("navigate to product page on edit icon clicked", async () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    const editIcon = screen.getByRole("link");
    expect(editIcon).toBeInTheDocument();
    await userEvent.click(editIcon);

    const productPage = screen.getByText(/Product Page/i);
    expect(productPage).toBeInTheDocument();
  });
});
