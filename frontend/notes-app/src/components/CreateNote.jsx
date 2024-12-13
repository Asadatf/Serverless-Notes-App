import { useState } from "react";
import { useNotesContext } from "../hooks/useNotesContext.js";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { API_ROUTES } from "../constants.js";
import { Tiptap } from "./TipTap.jsx";

const CreateNote = () => {
  const { dispatch } = useNotesContext();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const note = { title, content };

    const response = await fetch(API_ROUTES.NOTES, {
      method: "POST",
      body: JSON.stringify(note),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      setTitle("");
      setContent("");
      setError(null);
      console.log("New Note Added", json);
      dispatch({ type: "CREATE_NOTE", payload: json });
    }
  };

  return (
    <form className="note" onSubmit={handleSubmit}>
      <textarea
        placeholder="Add Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={50}
        className="title"
      />
      <Tiptap setContent={setContent} content={content} />
      <div className="note_footer">
        <button className="note_save">Save</button>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default CreateNote;
