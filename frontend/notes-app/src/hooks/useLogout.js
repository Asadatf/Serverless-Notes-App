import { useAuthContext } from "./useAuthContext";
import { useNotesContext } from "./useNotesContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: notesDispatch } = useNotesContext();

  const logout = () => {
    // remove user form storage
    localStorage.removeItem("user");

    // dispatch logout action
    dispatch({ type: "LOGOUT" });
    notesDispatch({ type: "SET_NOTES", payload: null });
  };

  return { logout };
};
