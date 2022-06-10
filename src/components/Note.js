const Note = ({ id, note, toggleImportance }) => {
  const label = note.important ? "make not important" : "make important";
  return (
    <li key={id} className="note">
      {note.content}
      <button className="importanceToggle" onClick={toggleImportance}>
        {label}
      </button>
    </li>
  );
};

export default Note;
