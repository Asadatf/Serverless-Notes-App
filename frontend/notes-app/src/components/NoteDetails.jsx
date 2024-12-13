import { useNotesContext } from "../hooks/useNotesContext";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { API_ROUTES } from "../constants";
import parse from "html-react-parser";
import { Tiptap } from "./TipTap";

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const NoteDetails = ({ note }) => {
  const { dispatch } = useNotesContext();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(note.title);
  const [updatedContent, setUpdatedContent] = useState(note.content);
  const { user } = useAuthContext();

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmDelete) {
      return;
    }

    const response = await fetch(`${API_ROUTES.NOTES}/${note._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_NOTE", payload: json });
    }
  };

  const handleEdit = async (e) => {
    if (!user) {
      return;
    }

    e.preventDefault();
    console.log("Edit initiated with:", updatedTitle, updatedContent);

    const updatedNote = { title: updatedTitle, content: updatedContent };

    try {
      const response = await fetch(`${API_ROUTES.NOTES}/${note._id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedNote),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      console.log("Server response:", json);

      if (response.ok) {
        dispatch({ type: "UPDATE_NOTE", payload: json });
        setIsEditing(false);
      } else {
        console.error("Failed to update note:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const displayTimestamp = note.updatedAt || note.createdAt;

  return (
    <div>
      {!isEditing ? (
        <>
          <div className="note">
            <h4 className="note-title">
              <b>{note.title}</b>
            </h4>
            <p className="note-body">{parse(note.content)}</p>
            <div className="note_footer">
              <p>
                {formatDistanceToNow(new Date(displayTimestamp), {
                  addSuffix: true,
                })}
              </p>
              <span
                className="material-symbols-outlined"
                style={{ color: "blue" }}
                onClick={() => setIsEditing(true)} // Set to editing mode
              >
                edit
              </span>
              <span
                className="material-symbols-outlined"
                style={{ color: "red" }}
                onClick={handleDelete}
              >
                delete
              </span>
            </div>
          </div>
        </>
      ) : (
        <form className="note" onSubmit={handleEdit}>
          <textarea
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            placeholder="Add Title"
            maxLength={50}
            className="title"
          />
          <Tiptap setContent={setUpdatedContent} content={updatedContent} />
          <div className="note_footer">
            <button type="submit" className="note_save">
              Save
            </button>
            <button
              type="button"
              className="note_save"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NoteDetails;
