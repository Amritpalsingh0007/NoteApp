import type React from "react"
import useUserContext from "../context/UserContext"
import { deleteNote } from "../service/noteService";

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

    const edit = ()=>{
        setEditNote({_id, title, content});
        setPageState("edit")
    }

    const remove = ()=>{
        if(!token){
            return;
        }
        deleteNote(token, _id).then((res)=>{
            if(res.success && res.code===200){
                alert("Note Deleted Successfully!");
                refreshNotes();
            }
        }).catch((error)=>{
            alert("Unable to delete note! \n"+error.message);
        });
    }

  return (
    <div key={_id} className="flex items-center justify-between bg-white text-shadow-black text-black rounded text-shadow-2xs w-full my-2 font-bold p-1">
        <h2 className="bg-transparent  font-bold" >
            {title}
        </h2>
        <div className="flex gap-2">
        <button className="bg-blue-700 text-white font-bold rounded p-2" onClick={edit}>Edit</button>
        <button className="bg-red-700 text-white font-bold rounded p-2" onClick={remove}>Delete</button>
        </div>
    </div>
  )
}

export default Note