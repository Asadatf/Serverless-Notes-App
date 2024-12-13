import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import parse from "html-react-parser";
import {
  FaBold,
  FaHeading,
  FaItalic,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaRedo,
  FaStrikethrough,
  FaUnderline,
  FaUndo,
} from "react-icons/fa";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const handleButtonClick = (e) => {
    e.preventDefault(); // Prevent form submission when editing
  };

  return (
    <div className="menuBar">
      <div>
        <button
          onClick={(e) => {
            handleButtonClick(e);
            editor.chain().focus().toggleBold().run();
          }}
          className={editor.isActive("bold") ? "is_active" : ""}
        >
          <FaBold />
        </button>
        <button
          onClick={(e) => {
            handleButtonClick(e);
            editor.chain().focus().toggleItalic().run();
          }}
          className={editor.isActive("italic") ? "is_active" : ""}
        >
          <FaItalic />
        </button>
        <button
          onClick={(e) => {
            handleButtonClick(e);
            editor.chain().focus().toggleUnderline().run();
          }}
          className={editor.isActive("underline") ? "is_active" : ""}
        >
          <FaUnderline />
        </button>
        <button
          onClick={(e) => {
            handleButtonClick(e);
            editor.chain().focus().toggleStrike().run();
          }}
          className={editor.isActive("strike") ? "is_active" : ""}
        >
          <FaStrikethrough />
        </button>
        <button
          onClick={(e) => {
            handleButtonClick(e);
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={
            editor.isActive("heading", { level: 2 }) ? "is_active" : ""
          }
        >
          <FaHeading />
        </button>
        <button
          onClick={(e) => {
            handleButtonClick(e);
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          className={
            editor.isActive("heading", { level: 3 }) ? "is_active" : ""
          }
        >
          <FaHeading className="heading3" />
        </button>
        <button
          onClick={(e) => {
            handleButtonClick(e);
            editor.chain().focus().toggleBulletList().run();
          }}
          className={editor.isActive("bulletList") ? "is_active" : ""}
        >
          <FaListUl />
        </button>
        <button
          onClick={(e) => {
            handleButtonClick(e);
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={editor.isActive("orderedList") ? "is_active" : ""}
        >
          <FaListOl />
        </button>
        <button
          onClick={(e) => {
            handleButtonClick(e);
            editor.chain().focus().toggleBlockquote().run();
          }}
          className={editor.isActive("blockquote") ? "is_active" : ""}
        >
          <FaQuoteLeft />
        </button>
      </div>
      <div>
        <button
          onClick={(e) => {
            handleButtonClick(e);
            editor.chain().focus().undo().run();
          }}
        >
          <FaUndo />
        </button>
        <button
          onClick={(e) => {
            handleButtonClick(e);
            editor.chain().focus().redo().run();
          }}
        >
          <FaRedo />
        </button>
      </div>
    </div>
  );
};

export const Tiptap = ({ setContent, content }) => {
  const cleanHtml = (html) => {
    // Remove <p> tags inside <ul> and <li>
    return html.replace(/<p>/g, "").replace(/<\/p>/g, "");
  };

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content,

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const newHTML = cleanHtml(html);
      console.log("HTML:", html);
      setContent(html); // Update content state in CreateNote
    },
  });

  return (
    <div className="textEditor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} data-testid="tiptap-editor" />
    </div>
  );
};
