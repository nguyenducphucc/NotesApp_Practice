import { useState } from "react";

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNotes] = useState("");

  const handleChange = (e) => {
    setNewNotes(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createNote({
      content: newNote,
      important: false,
    });

    setNewNotes("");
  };
  return (
    <div className="formDiv">
      <h2>Create a new note</h2>

      <form onSubmit={handleSubmit}>
        <input value={newNote} onChange={handleChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default NoteForm;
