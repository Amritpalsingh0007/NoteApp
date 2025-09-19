import React, { useState } from "react";
import { createNote } from "../service/noteService";
import useUserContext from "../context/UserContext";

function CreateNote({setPageState}:{setPageState:React.Dispatch<React.SetStateAction<"edit" | "create" | "upgrade"|"none">>}) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const {token} = useUserContext();

    function handleForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (title.trim() === "") {
            alert("Please enter a title");
            return;
        }
        if(content.trim() === ""){
            alert("Please enter content");
            return;
        }
        if(!token){
            return;
        }

        createNote(token, title, content).then((res)=>{
            if(res.success && res.code === 201){
                alert("Note created Successfully!");
            }
            else if(res.data?.code === 4031){
                alert("Reached Max Note Limit!");
                setPageState("upgrade");
                return;
            }else{
                alert(res.data?.message||"unable to create note!");
            }
            setPageState("none");
        }).catch((error)=>{
            alert("Unable to create Note! \n"+error.message);
            setPageState("none");
        })
        
    }
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
          className="rounded-lg  bg-blue-700  p-2 font-bold text-white my-1"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateNote;
