import { BASE_URL } from "../config/config";

export async function upgradeMembership(token:string, tenant_id:string) {
    //encryption logic here
  const notesURL =`${BASE_URL}/tenants/${tenant_id}/upgrade`;
  try {
    const response = await fetch(notesURL,{
        method:"POST",
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