import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { vi } from "vitest";
import AddProductModal from "../../src/components/AddProductModal";
import * as useProductStoreModule from "../../src/store/useProductStore";

const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>;
};

const mockAddProduct = vi.fn();
const mockSetFormData = vi.fn();

const defaultState = {
  formData: {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: "",
  },
  loading: false,
  setFormData: mockSetFormData,
  addProduct: mockAddProduct,
};

describe("AddProductModal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock dialog methods
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();

    // Mock the product store
    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      ...defaultState,
      addProduct: mockAddProduct,
      setFormData: mockSetFormData,
    });

    render(<AddProductModal />);

    // Simulate modal open
    const modal = document.getElementById(
      "addProductModal",
    ) as HTMLDialogElement;
    modal.setAttribute("open", "");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders form field and handles input changes with userEvent", async () => {
    const nameInput = screen.getByPlaceholderText(/Enter product name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Test Product");
    expect(nameInput).toBeInTheDocument();

    const descInput = screen.getByPlaceholderText(/Enter product description/i);
    await userEvent.clear(descInput);
    await userEvent.type(descInput, "Test description of product");
    expect(descInput).toBeInTheDocument();

    const priceInput = screen.getByPlaceholderText(/\$ 0.00/i);
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, "90.99");
    expect(priceInput).toBeInTheDocument();

    const stockInput = screen.getByPlaceholderText("0");
    await userEvent.clear(stockInput);
    await userEvent.type(stockInput, "50");
    expect(stockInput).toBeInTheDocument();

    expect(mockSetFormData).toHaveBeenCalled();
  });

  it("uploads file successfully", async () => {
    const file = new File(["dummy"], "example.jpg", { type: "image/jpg" });

    mockedAxios.post = vi.fn().mockResolvedValue({
      data: { filename: "image.jpg" },
    });

    const fileInput = screen.getByLabelText(/upload image/i);
    await userEvent.upload(fileInput, file);

    const uploadButton = screen.getByRole("button", { name: /upload/i });
    await userEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockSetFormData).toHaveBeenCalledWith(
        expect.objectContaining({ image: "image.jpg" }),
      );
    });

    expect(screen.getByText("Image Uploaded")).toBeInTheDocument();
  });

  it("shows error message when upload fails", async () => {
    const file = new File(["dummy"], "example.jpg", { type: "image/jpg" });

    mockedAxios.post = vi.fn().mockRejectedValue(new Error("Upload failed"));

    const fileInput = screen.getByLabelText(/upload image/i);
    await userEvent.upload(fileInput, file);

    const uploadButton = screen.getByRole("button", { name: /upload/i });
    await userEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText("Upload Failed")).toBeInTheDocument();
    });
  });

  it("calls addProduct on form submit", async () => {
    // Fill out form fields
    await userEvent.type(
      screen.getByLabelText(/product name/i),
      "Test Product",
    );
    await userEvent.type(
      screen.getByLabelText(/product description/i),
      "Nice product",
    );
    await userEvent.type(screen.getByLabelText(/price/i), "19.99");
    await userEvent.type(screen.getByLabelText(/stock/i), "10");

    // Click the submit button
    const submitButton = screen.getByRole("button", { name: /add product/i });
    await userEvent.click(submitButton);

    expect(mockAddProduct).toHaveBeenCalledTimes(0);
  });

  it("closes modal on cancel", async () => {
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await userEvent.click(cancelButton);

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });
});
