import { useState } from "react";
import "./login.css";
import { login } from "../service/authService";
import useLoginContext from "../context/UserContext";
function Login() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const { updateTokenAndTenantId } = useLoginContext();
  const [error, setError] = useState<{
    message: string;
    status: number;
  } | null>(null);

  function handleLogin() {
    login(emailId, password).then((res) => {
      if (res.success && res.code === 200) {
        updateTokenAndTenantId(
          res.data?.token ?? null,
          res.data?.tenant_id ?? null
        );
      } else {
        setError({message: res.message, status: res.code});
        setTimeout(() => setError(null), 3000);
      }
    }).catch((error)=>{
      setError({message: error.message, status: error.code});
      setTimeout(() => setError(null), 3000);
    });
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-700 ">
      {error ? (
        <>
          <div className="bg-white rounded-2xl min-w-[30%] min-h-[30%] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-red-600 text-white font-bold px-6 py-3 flex items-center justify-between">
              <h1 className="text-lg">Error {error.status}</h1>
            </div>

            {/* Body */}
            <div className="flex-1 px-6 py-4 text-gray-700 flex items-center justify-center">
              <p className="text-center">{error.message}</p>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 flex justify-end bg-white">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                onClick={() => setError(null)}
              >
                OK
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className=" bg-white rounded-2xl shadow-2xl relative z-10 p-5">
            <h1 className="text-black font-bold text-4xl mb-2">Login</h1>
            <input
              type="text"
              onChange={(e) => setEmailId(e.target.value)}
              value={emailId}
              placeholder="Email ID"
            />
            <br />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
            />
            <br />
            <button
              className="bg-black p-2 rounded text-white font-bold active:bg-gray-700 hover:scale-105"
              onClick={handleLogin}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Login;
