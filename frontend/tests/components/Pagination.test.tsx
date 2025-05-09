import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "../../src/components/Pagination";
import * as useProductStoreModule from "../../src/store/useProductStore";

describe("Pagination Component", () => {
  const mockSetPage = vi.fn();

  beforeEach(() => {
    vi.spyOn(useProductStoreModule, "useProductStore").mockReturnValue({
      setPage: mockSetPage,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const setup = (
    currentPage: number,
    totalPages: number,
    totalProducts: number | null
  ) => {
    render(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalProducts={totalProducts}
      />
    );
  };

  it("renders pagination info correctly", () => {
    setup(1, 5, 25);

    const matches = screen.getAllByText((_, el) => {
      return el?.textContent === "Showing 1 to 5 of 25 results";
    });

    expect(matches[0]).toBeInTheDocument();
  });

  it("disables Previous button on first page", () => {
    setup(1, 5, 25);

    const prevButtons = screen.getAllByRole("button", { name: /previous/i });
    prevButtons.forEach((btn) => {
      return expect(btn).toBeDisabled();
    });
  });

  it("disables Next button on last page", () => {
    setup(5, 5, 25);

    const nextButtons = screen.getAllByRole("button", { name: /next/i });
    nextButtons.forEach((btn) => {
      return expect(btn).toBeDisabled();
    });
  });

  it("calls setPage with specific page number when number button clicked", async () => {
    setup(1, 5, 25);

    const pageBtn = screen.getByRole("button", { name: "3" });
    await userEvent.click(pageBtn);

    expect(mockSetPage).toHaveBeenCalledWith(3);
  });

  it("calls setPage with currentPage - 1 when Previous clicked", async () => {
    setup(3, 5, 25);

    const prevButtons = screen.getAllByRole("button", { name: /previous/i });
    await userEvent.click(prevButtons[0]);

    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it("calls setPage with currentPage + 1 when Next clicked", async () => {
    setup(3, 5, 25);

    const nextButtons = screen.getAllByRole("button", { name: /next/i });
    await userEvent.click(nextButtons[0]);

    expect(mockSetPage).toHaveBeenCalledWith(4);
  });
});
