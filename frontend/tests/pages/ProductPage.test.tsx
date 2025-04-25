import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductPage from "../../src/pages/ProductPage";
import * as useProductStoreModule from "../../src/store/useProductStore";
import { BrowserRouter } from "react-router-dom";

import React from "react";

// Mocks

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => {
      return mockNavigate;
    },
    useParams: () => {
      return { id: "1" };
    },
  };
});

const renderPage = () => {
  return render(
    <BrowserRouter>
      <ProductPage />
    </BrowserRouter>
  );
};

describe("ProductPage", () => {
  const mockFetchProduct = vi.fn();
  const mockUpdateProduct = vi.fn();
  const mockDeleteProduct = vi.fn();
  const mockSetFormData = vi.fn();

  beforeEach(() => {
    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      formData: {
        name: "Sample Product",
        description: "A Test Product",
        price: 99.99,
        stock: 10,
        image: "test.jpg",
      },
      fetchProduct: mockFetchProduct,
      updateProduct: mockUpdateProduct,
      deleteProduct: mockDeleteProduct,
      setFormData: mockSetFormData,
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("render loading spinner when loading is true", () => {
    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      ...useProductStoreModule.useProductStore(),
      loading: true,
    });

    renderPage();

    const loader = screen.getByRole("img", { hidden: true });

    expect(loader).toBeInTheDocument();
  });

  it("render error message if error exists", () => {
    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      ...useProductStoreModule.useProductStore(),
      error: "Something went wrong",
    });

    renderPage();

    const errorMsg = screen.getByText("Something went wrong");

    expect(errorMsg).toBeInTheDocument();
  });

  it("call fetchProduct with correct id when page is load", async () => {
    renderPage();

    await waitFor(() => {
      expect(mockFetchProduct).toHaveBeenCalledWith(1);
    });
  });

  it("navigates back to product list when Back to Product button is clicked and Edit Product ", async () => {
    renderPage();

    const backButton = screen.getByRole("button", { name: /back to product/i });
    const heading = screen.getByText("Edit Product");

    expect(heading).toBeInTheDocument();

    await userEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("render the form field with their defaultValues", () => {
    renderPage();

    const productName = screen.getByDisplayValue("Sample Product");
    const productDesc = screen.getByDisplayValue("A Test Product");
    const productPrice = screen.getByDisplayValue(99.99);
    const productStock = screen.getByDisplayValue(10);
    const productImg = screen.getByAltText("Product") as HTMLImageElement;

    expect(productName).toBeInTheDocument();
    expect(productDesc).toBeInTheDocument();
    expect(productPrice).toBeInTheDocument();
    expect(productStock).toBeInTheDocument();
    expect(productImg).toHaveAttribute("src", "/api/uploads/test.jpg");
  });

  it("allow editing the product and submit the button", async () => {
    renderPage();

    const nameInput = screen.getByPlaceholderText(/Enter product name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "New Product");

    const descInput = screen.getByPlaceholderText(/Enter product description/i);
    await userEvent.clear(descInput);
    await userEvent.type(descInput, "New description of product");

    const priceInput = screen.getByPlaceholderText(/\$ 0.00/i);
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, "90.99");

    const stockInput = screen.getByPlaceholderText("0");
    await userEvent.clear(stockInput);
    await userEvent.type(stockInput, "50");

    const submitBtn = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUpdateProduct).toHaveBeenCalledWith(1);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("calls deleteProduct after confirming", async () => {
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);
    renderPage();

    const dltBtn = screen.getByRole("button", { name: /delete product/i });
    await userEvent.click(dltBtn);

    await waitFor(() => {
      expect(mockDeleteProduct).toHaveBeenCalledWith(1);
    });
  });

  it("allows selecting and uploading a file", async () => {
    renderPage();
    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });

    const fileInput = screen.getByLabelText(
      /change image/i
    ) as HTMLInputElement;
    await userEvent.upload(fileInput, file);

    expect(fileInput.files?.[0]).toStrictEqual(file);
    expect(fileInput.files?.item(0)).toStrictEqual(file);

    const uploadButton = screen.getByRole("button", { name: /upload/i });
    await userEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText("Image Uploaded")).toBeInTheDocument();
    });
  });
});
