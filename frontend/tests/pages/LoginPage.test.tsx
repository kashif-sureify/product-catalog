import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import * as useAuthStoreModule from "../../src/store/useAuthStore";
import LoginPage from "../../src/pages/LoginPage";

describe("LoginPage", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(useAuthStoreModule, "useAuthStore").mockReturnValue({
      login: mockLogin,
    });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <LoginPage />
      </MemoryRouter>,
    );
  });

  it("should allow user to fill form and submit", async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    const loginBtn = screen.getByRole("button", { name: /login/i });
    expect(loginBtn).toBeInTheDocument();

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password@123");

    await userEvent.click(loginBtn);

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password@123",
    });
  });

  it("should render link ", async () => {
    const header = screen.getAllByText(/login/i);
    const textlogin = screen.getByText(/don't have an account \?/i);
    const link = screen.getByRole("link", { name: /signup/i });

    expect(link).toBeInTheDocument();
    expect(textlogin).toBeInTheDocument();
    expect(header[0]).toBeInTheDocument();

    await userEvent.click(link);
    expect(link).toHaveAttribute("href", "/signup");
  });
});
