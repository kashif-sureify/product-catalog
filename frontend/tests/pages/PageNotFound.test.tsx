import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PageNotFound from "../../src/pages/PageNotFound";

describe("PageNotFound", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <PageNotFound />
      </MemoryRouter>,
    );
  });

  it("render all the text and link on page load", async () => {
    const text404 = screen.getByText(/404/i);
    const header = screen.getByText(/page not found/i);
    const para = screen.getByText(
      /sorry, we couldn't find the page you're looking for/i,
    );

    const link = screen.getByRole("link", { name: /home/i });

    expect(text404).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(para).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    await userEvent.click(link);

    expect(link).toHaveAttribute("href", "/");
  });
});
