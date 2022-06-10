import { useState, useEffect, useRef } from "react";
import Note from "./components/Note";
import Timer from "./components/Timer";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import NoteForm from "./components/NoteForm";
import noteServices from "./services/notes";
import loginService from "./services/login";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const App = (props) => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState("null");
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    noteServices
      .getAll()
      .then((res) => {
        setNotes(res);
      })
      .catch((error) => {
        setErrorMessage("fail at getAll");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteServices.getToken(user.token);
    }
  }, []);

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility();
    noteServices
      .create(noteObject)
      .then((res) => {
        setNotes(notes.concat(res));
      })
      .catch((error) => {
        setErrorMessage("please login before creating note!");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteServices
      .update(id, changedNote)
      .then((res) => {
        setNotes(notes.map((note) => (note.id !== id ? note : res)));
      })
      .catch((error) => {
        setErrorMessage(
          `the note '${note.content}' was already deleted from the server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((note) => note.id !== id));
      });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const loginUser = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem(
        "loggedNoteappUser",
        JSON.stringify(loginUser)
      );
      noteServices.getToken(loginUser.token);
      setUser(loginUser);
      setPassword("");
      setUsername("");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const noteFormRef = useRef();
  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  );

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  );

  return (
    <div>
      <h1>Notes</h1>
      <Notification className="error" message={errorMessage} />

      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>Welcome {user.name}</p>
          {noteForm()}
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <Timer />
    </div>
  );
};

export default App;
