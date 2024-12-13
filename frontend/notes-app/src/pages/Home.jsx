import { useEffect } from "react";
import { useNotesContext } from "../hooks/useNotesContext.js";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { API_ROUTES } from "../constants.js";

// Components
import NoteDetails from "../components/NoteDetails";
import CreateNote from "../components/CreateNote";

const Home = () => {
  const { notes, dispatch } = useNotesContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await fetch(API_ROUTES.NOTES, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_NOTES", payload: json });
        console.log("Fetched notes:", json); // Log fetched notes here
      } else {
        console.log("Fetch error:", response.error);
      }
    };

    if (user) {
      fetchNotes();
    }
  }, [dispatch, user]);

  return (
    <div className="notes">
      <CreateNote />
      {notes && notes.map((note) => <NoteDetails key={note._id} note={note} />)}
    </div>
  );
};

export default Home;
