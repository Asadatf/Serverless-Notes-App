import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContextProvider } from "../../context/AuthContext";
import Signup from "../../pages/Signup";

beforeEach(() => {
  global.fetch = vi.fn();
});

describe("Signup Page", () => {
  it("should render signup form with username, email, password fields, and signup button", () => {
    render(
      <AuthContextProvider>
        <Router>
          <Signup />
        </Router>
      </AuthContextProvider>
    );

    expect(screen.getByPlaceholderText("Enter Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /signup/i })).toBeInTheDocument();
  });

  it("should call signup function with correct inputs on form submission", async () => {
    const mockResponse = { success: true };
    fetch.mockResolvedValueOnce({
      json: () => mockResponse,
      status: 200,
    });

    render(
      <AuthContextProvider>
        <Router>
          <Signup />
        </Router>
      </AuthContextProvider>
    );

    const usernameField = screen.getByPlaceholderText("Enter Username");
    const emailField = screen.getByPlaceholderText("Email");
    const passwordField = screen.getByPlaceholderText("Enter Password");
    const signupButton = screen.getByRole("button", { name: /signup/i });

    fireEvent.change(usernameField, { target: { value: "testUser" } });
    fireEvent.change(emailField, { target: { value: "test@example.com" } });
    fireEvent.change(passwordField, { target: { value: "testPassword" } });

    fireEvent.click(signupButton);

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/signup"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            username: "testUser",
            email: "test@example.com",
            password: "testPassword",
          }),
        })
      )
    );
  });

  it("should navigate to login page when login link is clicked", () => {
    render(
      <AuthContextProvider>
        <Router>
          <Signup />
        </Router>
      </AuthContextProvider>
    );

    const loginLink = screen.getByRole("link", { name: /log in/i });

    fireEvent.click(loginLink);

    expect(window.location.pathname).toBe("/login");
  });
});
