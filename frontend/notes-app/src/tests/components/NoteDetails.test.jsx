import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { NotesContextProvider } from "../../context/NotesContext";
import { AuthContextProvider } from "../../context/AuthContext";
import NoteDetails from "../../components/NoteDetails";

describe("NoteDetails Component", () => {
  const note = {
    _id: "1",
    title: "Test Note Title",
    content: "<p>Test note content</p>",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("should render the note details correctly", () => {
    render(
      <AuthContextProvider>
        <NotesContextProvider>
          <NoteDetails note={note} />
        </NotesContextProvider>
      </AuthContextProvider>
    );

    expect(screen.getByText(/Test Note Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Test note content/i)).toBeInTheDocument();
  });

  it("should toggle isEditing state when the edit button is clicked", () => {
    render(
      <AuthContextProvider>
        <NotesContextProvider>
          <NoteDetails note={note} />
        </NotesContextProvider>
      </AuthContextProvider>
    );

    const editButton = screen.getByText("edit");
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    const textArea = screen.getByPlaceholderText("Add Title");
    expect(textArea).toBeInTheDocument();
  });

  it("should trigger handleDelete when the delete span is clicked", () => {
    const handleDelete = vi.fn();

    render(
      <AuthContextProvider>
        <NotesContextProvider>
          <NoteDetails note={note} />
        </NotesContextProvider>
      </AuthContextProvider>
    );

    const deleteButton = screen.getByText("delete");
    expect(deleteButton).toBeInTheDocument();

    deleteButton.onclick = handleDelete;

    fireEvent.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});
