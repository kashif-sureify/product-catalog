import { render, screen } from "@testing-library/react";
import Pagination from "../../src/components/Pagination";
import React from "react";
import userEvent from "@testing-library/user-event";

describe("Pagination Component", () => {
  const setup = (
    currentPage: number,
    totalPages: number,
    totalProducts: number | null
  ) => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalProducts={totalProducts}
        onPageChange={onPageChange}
      />
    );

    return { onPageChange };
  };

  it("renders pagination info correctly", () => {
    setup(1, 5, 15);

    const pageInfo = screen.getByText(/showing/i);
    expect(pageInfo).toHaveTextContent("Showing 1 to 5 of 15 results");
  });

  it("disables previous button on first page", () => {
    setup(1, 5, 15);

    const prevBtn = screen.getAllByRole("button", { name: /previous/i });
    expect(prevBtn[0]).toBeDisabled();
  });

  it("disables next button on last page", () => {
    setup(5, 5, 15);

    const nextBtn = screen.getAllByRole("button", { name: /next/i });
    expect(nextBtn[0]).toBeDisabled();
  });

  it("calls onPageChange when a correct page number is clicked", async () => {
    const { onPageChange } = setup(1, 5, 15);

    const page2Btn = screen.getByRole("button", { name: /2/i });
    await userEvent.click(page2Btn);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with currentPage - 1 when Previos page button is clicked", async () => {
    const { onPageChange } = setup(3, 5, 15);

    const prevBtn = screen.getAllByRole("button", { name: /previous/i });
    await userEvent.click(prevBtn[0]);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with currentPage + 1 when Next page button is clicked", async () => {
    const { onPageChange } = setup(3, 5, 15);

    const nextBtn = screen.getAllByRole("button", { name: /next/i });
    await userEvent.click(nextBtn[0]);
    expect(onPageChange).toHaveBeenCalledWith(4);
  });
});
