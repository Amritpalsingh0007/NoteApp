import { BASE_URL } from "../config/config";

export async function getAllNotes(token:string) {
    //encryption logic here
  const notesURL = BASE_URL + "/notes";
  try {
    const response = await fetch(notesURL,{
        method:"GET",
        headers:{
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();
    return { success: response.ok, code: response.status, message: data.message, data };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, code: 0, message: error.message };
    } else {
      return { success: false, code: 0, message: "Unkown error" };
    }
  }
}

export async function getNote(token:string, id:string) {
    //encryption logic here
  const notesURL = BASE_URL + "/notes/"+id;
  try {
    const response = await fetch(notesURL,{
        method:"GET",
        headers:{
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();
    return { success: response.ok, code: response.status, message: data.message, data };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, code: 0, message: error.message };
    } else {
      return { success: false, code: 0, message: "Unkown error" };
    }
  }
}

export async function createNote(token:string, title: string, content: string) {
    //encryption logic here
  const notesURL = BASE_URL + "/notes";
  try {
    const response = await fetch(notesURL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content
      }),
    });

    const data = await response.json();
    return { success: response.ok, code: response.status, message: data.message, data };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, code: 0, message: error.message };
    } else {
      return { success: false, code: 0, message: "Unkown error" };
    }
  }
}

export async function updateNote(token:string, id:string, title: string, content: string) {
    //encryption logic here
  const notesURL = BASE_URL + "/notes/"+id;
  
  try {
    const response = await fetch(notesURL, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content
      }),
    });

    const data = await response.json();
    return { success: response.ok, code: response.status, message: data.message, data };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, code: 0, message: error.message };
    } else {
      return { success: false, code: 0, message: "Unkown error" };
    }
  }
}

export async function deleteNote(token:string, id:string) {
    //encryption logic here
  const notesURL = BASE_URL + "/notes/"+id;
  try {
    const response = await fetch(notesURL, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return { success: response.ok, code: response.status, message: data.message, data };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, code: 0, message: error.message };
    } else {
      return { success: false, code: 0, message: "Unkown error" };
    }
  }
}