import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import ResetPassword from "../../pages/ResetPassword";
import { useParams } from "react-router-dom";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(),
    BrowserRouter: actual.BrowserRouter,
  };
});

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: "Password updated" }),
  })
);

describe("ResetPassword Component", () => {
  beforeEach(() => {
    // Mock the useParams hook to return a fake token
    useParams.mockReturnValue({ token: "fakeToken123" });

    render(
      <Router>
        <ResetPassword />
      </Router>
    );
  });

  it("should render the reset password form with password input fields and submit button", () => {
    expect(
      screen.getByPlaceholderText("Enter New Password")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm New Password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset password/i })
    ).toBeInTheDocument();
  });

  it("should handle form submission with valid passwords", async () => {
    const newPasswordInput = screen.getByPlaceholderText("Enter New Password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm New Password"
    );
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    fireEvent.change(newPasswordInput, { target: { value: "ValidPass123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "ValidPass123!" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    await waitFor(() =>
      expect(screen.getByText(/Password Updated/i)).toBeInTheDocument()
    );

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "ValidPass123!" }),
      })
    );
  });

  it("should handle form submission with mismatched passwords", async () => {
    const newPasswordInput = screen.getByPlaceholderText("Enter New Password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm New Password"
    );
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    fireEvent.change(newPasswordInput, { target: { value: "ValidPass123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "DifferentPass456!" },
    });

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText(/Passwords must match/i)).toBeInTheDocument()
    );
  });
});
