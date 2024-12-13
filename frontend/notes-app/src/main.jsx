import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { NotesContextProvider } from "./context/NotesContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <NotesContextProvider>
        <App />
      </NotesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
