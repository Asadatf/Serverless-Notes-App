import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContextProvider } from "../../context/AuthContext";
import { NotesContextProvider } from "../../context/NotesContext";
import Navbar from "../../components/Navbar";

describe("Navbar Component", () => {
  beforeEach(() => {
    // Clear the user from localStorage before each test
    global.localStorage.removeItem("user");
  });
  it("should render the Navbar correctly without a user", () => {
    render(
      <AuthContextProvider value={{ user: null }}>
        <NotesContextProvider>
          <Router>
            <Navbar />
          </Router>
        </NotesContextProvider>
      </AuthContextProvider>
    );

    expect(screen.getByText("Notes App")).toBeInTheDocument();

    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.getByText("Signup")).toBeInTheDocument();
  });

  it("should render the Navbar correctly with a logged-in user", () => {
    const user = { username: "testUser" };
    global.localStorage.setItem("user", JSON.stringify(user));

    render(
      <AuthContextProvider>
        <NotesContextProvider>
          <Router>
            <Navbar />
          </Router>
        </NotesContextProvider>
      </AuthContextProvider>
    );

    expect(screen.getByText("Notes App")).toBeInTheDocument();

    expect(screen.getByText(/testUser/i)).toBeInTheDocument();

    const logoutButton = screen.getByRole("button", { name: /log out/i });
    expect(logoutButton).toBeInTheDocument();
  });
});
