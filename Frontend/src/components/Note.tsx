import type React from "react"
import useUserContext from "../context/UserContext"
import { deleteNote } from "../service/noteService";
import { useState } from "react";

type propType = {
    title:string, 
    content:string, 
    _id:string, 
    setPageState: React.Dispatch<React.SetStateAction<"edit" | "create" | "upgrade"|"none">>,
    setEditNote: React.Dispatch<React.SetStateAction<{_id:string, title:string, content:string} | null>>,
    refreshNotes: Function
}

function Note({title, content, _id, setPageState, setEditNote, refreshNotes}:propType) {
    const {token} = useUserContext();
    const [disable, setDisable] = useState(false);
    const edit = ()=>{
        setEditNote({_id, title, content});
        setPageState("edit")
    }

    const remove = ()=>{
        setDisable(true);
        if(!token){
            return;
        }
        deleteNote(token, _id).then((res)=>{
            if(res.success && res.code===200){
                alert("Note Deleted Successfully!");
                refreshNotes();
            }
        setDisable(false);

        }).catch((error)=>{
            alert("Unable to delete note! \n"+error.message);
            setDisable(false);
        });
    }

  return (
    <div key={_id} className="flex items-center justify-between bg-white text-shadow-black text-black rounded text-shadow-2xs w-full my-2 font-bold p-1">
        <h2 className="bg-transparent  font-bold" >
            {title}
        </h2>
        <div className="flex gap-2">
        <button className="bg-blue-700 text-white font-bold rounded p-2" onClick={edit}>Edit</button>

        <button className={`${disable ? "bg-gray-500" : "bg-red-700 hover:bg-red-800"} text-white font-bold rounded p-2`} disabled={disable} onClick={remove}>
            {disable ? (
            //Spinning Animation 
            <span className="w-full h-full flex justify-center items-center">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </span>
          ) : (
            "Delete"
          )}
        </button>
        </div>
    </div>
  )
}

export default Note