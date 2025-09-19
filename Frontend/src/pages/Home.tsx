import { useEffect, useState } from "react";
import { getAllNotes } from "../service/noteService";
import useUserContext from "../context/UserContext";
import Note from "../components/Note";
import CreateNote from "../components/CreateNote";
import EditNote from "../components/EditNote";
import Plan from "../components/Plan";

function Home() {
  const [note, setNote] = useState<
    { _id: string; title: string; content: string }[]
  >([]);
  const [pageState, setPageState] = useState<
    "edit" | "create" | "upgrade" | "none"
  >("none");
  const { token, updateTokenAndTenantId } = useUserContext();
  const [editNote, setEditNote] = useState<{
    _id: string;
    title: string;
    content: string;
  } | null>(null);
  const fetchNotes = () => {
    if (!token) {
      return;
    }
    getAllNotes(token).then((res) => {
      if (res.code !== 200) {
        alert("Unable to fetch data!");
        return;
      }
      if (res.data?.notes) {
        setNote(
          res.data.notes.map(
            (note: {
              _id: string;
              title: string;
              tenant_id: string;
              content: string;
              __V: number;
              createdAt: Date;
            }) => {
              return {
                _id: note._id,
                title: note.title,
                content: note.content,
              };
            }
          )
        );
      }
    });
  };

  useEffect(() => {
    fetchNotes();
  }, []);
  useEffect(() => {
    if (pageState === "none") {
      fetchNotes();
    }
  }, [pageState]);
  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center">
      {/* Main Card */}
      <div className="w-[80%] h-[80%] bg-gray-800 p-4 text-white rounded relative flex flex-col">
        {/* logout Button (inside card, top-right) */}
        <button
          className="absolute top-3 right-3 bg-red-700 px-3 py-1 rounded text-white font-bold"
          onClick={() => updateTokenAndTenantId(null, null)}
        >
          Logout
        </button>

        {/* Content */}
        <h1 className="my-2 text-3xl font-bold">Notes</h1>
        <hr />
        <div
          className="rounded bg-purple-700 p-2 mt-3 text-center cursor-pointer text-white font-bold"
          onClick={() => setPageState("upgrade")}
        >
          Upgrade Plan
        </div>
        <div
          className="rounded bg-blue-700 p-2 mt-3 text-center cursor-pointer text-white font-bold"
          onClick={() => setPageState("create")}
        >
          Create Note
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-2">
          {note.length !== 0 ? (
            note.map((obj) => (
              <Note
                key={obj._id}
                title={obj.title}
                _id={obj._id}
                content={obj.content}
                setPageState={setPageState}
                setEditNote={setEditNote}
                refreshNotes={fetchNotes}
              />
            ))
          ) : (
            <div>No Notes to display</div>
          )}
        </div>
      </div>

      {/* Popups */}
      {pageState === "create" && <CreateNote setPageState={setPageState} />}
      {pageState === "edit" && (
        <EditNote editNote={editNote} setPageState={setPageState} />
      )}
      {pageState === "upgrade" && <Plan setPageState={setPageState} />}
    </div>
  );
}

export default Home;
