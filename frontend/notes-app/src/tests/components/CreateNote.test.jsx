import "@testing-library/jest-dom";
import { NotesContextProvider } from "../../context/NotesContext";
import { AuthContextProvider } from "../../context/AuthContext";
import { render, screen } from "@testing-library/react";
import CreateNote from "../../components/CreateNote";
import userEvent from "@testing-library/user-event";

describe("CreateNote Component", () => {
  it("should render a form correctly", () => {
    render(
      <AuthContextProvider>
        <NotesContextProvider>
          <CreateNote />
        </NotesContextProvider>
      </AuthContextProvider>
    );

    // Check if the title input, content editor, and save button are rendered
    expect(screen.getByPlaceholderText(/Add Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Save/i)).toBeInTheDocument();

    const tiptapEditor = screen.getByTestId("tiptap-editor");
    expect(tiptapEditor).toBeInTheDocument();
  });

  it("should allow typing in the title input", async () => {
    render(
      <AuthContextProvider>
        <NotesContextProvider>
          <CreateNote />
        </NotesContextProvider>
      </AuthContextProvider>
    );

    const titleInput = screen.getByPlaceholderText(/Add Title/i);
    expect(titleInput).toBeInTheDocument();

    titleInput.focus();
    await userEvent.type(titleInput, "Test Note Title");

    expect(titleInput).toHaveValue("Test Note Title");
  });

  it("should show an error message if user is not logged in", async () => {
    // Mock the user context to simulate a user not being logged in
    render(
      <AuthContextProvider>
        <NotesContextProvider>
          <CreateNote />
        </NotesContextProvider>
      </AuthContextProvider>
    );

    const titleInput = screen.getByPlaceholderText("Add Title");
    await userEvent.type(titleInput, "Test Note Title");

    const saveButton = screen.getByText("Save");
    await userEvent.click(saveButton);

    const errorMessage = screen.getByText(/You must be logged in/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
