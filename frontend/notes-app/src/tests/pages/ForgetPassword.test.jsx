import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import ForgetPassword from "../../pages/ForgetPassword";

global.fetch = vi.fn((url, options) => {
  if (options.body.includes("test@example.com")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: "Email sent successfully" }),
    });
  }

  return Promise.resolve({
    ok: false,
    json: () => Promise.resolve({ message: "Invalid email address" }),
  });
});

describe("ForgetPassword Component", () => {
  it("should render the forget password form with an email input and a submit button", () => {
    render(
      <Router>
        <ForgetPassword />
      </Router>
    );

    expect(screen.getByPlaceholderText("Enter Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset link/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/remember your password\?/i)).toBeInTheDocument();
  });

  it("should handle form submission with a valid email", async () => {
    render(
      <Router>
        <ForgetPassword />
      </Router>
    );

    const emailInput = screen.getByPlaceholderText("Enter Email");
    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getByText(/email sent successfully/i)).toBeInTheDocument()
    );

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com" }),
      })
    );
  });
});
