import { BASE_URL } from "../config/config";
export async function login(emailId: string, password: string) {
  //add encoder/encryption here for password
  const loginURL = BASE_URL + "/auth/v1/login";
  try {
    const response = await fetch(loginURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_id: emailId,
        password,
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
