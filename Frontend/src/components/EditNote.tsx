import type React from "react";
import { useEffect, useState } from "react";
import { deleteNote, updateNote } from "../service/noteService";
import useUserContext from "../context/UserContext";


function EditNote({editNote, setPageState}:{editNote:{ _id: string; title: string; content: string } | null, setPageState:React.Dispatch<React.SetStateAction<"edit" | "create" | "upgrade"|"none">>}) {
    const [title, setTitle] = useState(editNote?.title);
        const [content, setContent] = useState(editNote?.content);
        const [disable, setDisable] = useState(false);
        const {token} = useUserContext();
    
        function handleForm(e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault();
            setDisable(true);
            if (!title || title.trim() === "") {
                alert("Please enter a title");
                return;
            }
            if(!content || content.trim() === ""){
                alert("Please enter content");
                return;
            }
            if(!token || !editNote){
                return;
            }
    
            updateNote(token, editNote._id, title, content).then((res)=>{
                if(res.success && res.code === 200){
                    alert("Note updated Successfully!");
                    setPageState("none");
                }

                if(res.code===403){
                    alert(res.data?.message || "Unable to update Note!")
                }
                setDisable(false);
                
            }).catch((error)=>{
                alert("Unable to update Note! \n"+error.message);
                setPageState("none");
        setDisable(false);
            })
            
        }
        const remove = ()=>{
            setDisable(true);
                if(!token || !editNote){
                    return;
                }
                deleteNote(token, editNote._id).then((res)=>{
                    if(res.success && res.code===200){
                        alert("Note Deleted Successfully!");
                        setPageState("none");
                        setDisable(false);
                    }
                }).catch((error)=>{
                    alert("Unable to delete note! \n"+error.message);
                    setPageState("none");
                    setDisable(false);
                });
                
            }
    useEffect(()=>{
        if(!editNote){
            alert("Note not selected!");
            setPageState("none");
        }
    },[])
  return (
    <div className="absolute top-[50%] left-[50%] translate-[-50%] shadow-2xl shadow-black bg-white rounded">
        <div className="flex justify-end rounded bg-white">
            <button className="relative right-0 bg-red-700 p-1.5 rounded text-white font-bold" onClick={()=>setPageState("none")}>X</button>
        </div>
            
      <form
        onSubmit={handleForm}
        className="flex flex-col bg-white rounded-md justify-around p-4 min-w-[300px] min-h-[300px]"
      >
        <label className="font-bold text-center text-2xl mb-3">Add New Note</label>
        
          <label className="font-bold">Title: </label>
          <input
            type="text"
            className="font-bold text-white rounded-md p-2 bg-gray-800 my-1"
            value={title}
            placeholder="Enter Title..."
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        <label className="font-bold ">content:</label>
        <input
          type="text"
          className="font-bold text-white rounded-md p-2 bg-gray-800 my-1"
          placeholder="Enter Content..."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <button
          type="submit"
          disabled={disable}
          className={`rounded-lg ${disable ? "bg-gray-500" : "bg-blue-700 hover:bg-blue-800"}  p-2 font-bold text-white my-1`}
        >
          Update
        </button>
        <button
          onClick={remove}
          disabled={disable}
          className={`rounded-lg ${disable ? "bg-gray-500" : "bg-red-700 hover:bg-red-800"} p-2 font-bold text-white my-1`}
        >
          Delete
        </button>
      </form>
    </div>
  )
}

export default EditNote