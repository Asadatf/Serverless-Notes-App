import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Login from "../../pages/Login";
import { BrowserRouter as Router } from "react-router-dom"; // For Link component
import { AuthContextProvider } from "../../context/AuthContext";

beforeEach(() => {
  global.fetch = vi.fn();
});

describe("Login Page", () => {
  it("should render login form with username, password fields, and login button", () => {
    render(
      <AuthContextProvider>
        <Router>
          <Login />
        </Router>
      </AuthContextProvider>
    );

    expect(screen.getByPlaceholderText("Enter Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("should toggle password visibility when icon is clicked", () => {
    render(
      <AuthContextProvider>
        <Router>
          <Login />
        </Router>
      </AuthContextProvider>
    );

    const passwordField = screen.getByPlaceholderText("Enter Password");
    expect(passwordField.type).toBe("password");

    const passwordIcon = screen.getByLabelText(/lock icon/i);
    expect(passwordIcon).toBeInTheDocument();

    fireEvent.click(passwordIcon);

    expect(passwordField.type).toBe("text");

    const unlockIcon = screen.getByLabelText(/unlock icon/i);
    expect(unlockIcon).toBeInTheDocument();

    fireEvent.click(unlockIcon);

    expect(passwordField.type).toBe("password");
  });

  it("should call login function with correct inputs on form submission", async () => {
    const mockResponse = { success: true };
    fetch.mockResolvedValueOnce({
      json: () => mockResponse,
      status: 200,
    });

    render(
      <AuthContextProvider>
        <Router>
          <Login />
        </Router>
      </AuthContextProvider>
    );

    const usernameField = screen.getByPlaceholderText("Enter Username");
    const passwordField = screen.getByPlaceholderText("Enter Password");
    const loginButton = screen.getByText(/log in/i);

    fireEvent.change(usernameField, { target: { value: "testUser" } });
    fireEvent.change(passwordField, { target: { value: "testPassword" } });

    fireEvent.click(loginButton);

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/login"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            username: "testUser",
            password: "testPassword",
          }),
        })
      )
    );
  });

  it("should navigate to signup page when signup link is clicked", () => {
    render(
      <AuthContextProvider>
        <Router>
          <Login />
        </Router>
      </AuthContextProvider>
    );

    const signupLink = screen.getByRole("link", { name: /signup/i });

    fireEvent.click(signupLink);

    expect(window.location.pathname).toBe("/signup");
  });
});
