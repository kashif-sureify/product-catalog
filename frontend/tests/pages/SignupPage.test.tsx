import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as useAuthStoreModule from "../../src/store/useAuthStore";
import React from "react";
import SignupPage from "../../src/pages/SignupPage";
import { MemoryRouter } from "react-router-dom";

describe("SignupPage", () => {
  const mockSignin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(useAuthStoreModule, "useAuthStore").mockReturnValue({
      signin: mockSignin,
    });

    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <SignupPage />
      </MemoryRouter>
    );
  });

  it("should allow user to fill form and submit", async () => {
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    const signupBtn = screen.getByRole("button", { name: /sign up/i });
    expect(signupBtn).toBeInTheDocument();

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password@123");

    await userEvent.click(signupBtn);

    expect(mockSignin).toHaveBeenCalledWith({
      username: "testuser",
      email: "test@example.com",
      password: "password@123",
    });
  });

  it("should render link ", async () => {
    const header = screen.getByText(/signup/i);
    const textlogin = screen.getByText(/already a member\?/i);
    const link = screen.getByRole("link", { name: /login/i });

    expect(link).toBeInTheDocument();
    expect(textlogin).toBeInTheDocument();
    expect(header).toBeInTheDocument();

    await userEvent.click(link);
    expect(link).toHaveAttribute("href", "/login");
  });
});
