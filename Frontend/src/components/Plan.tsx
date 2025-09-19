import type React from "react";
import useUserContext from "../context/UserContext";
import { upgradeMembership } from "../service/membershipService";

function Plan({
  setPageState,
}: {
  setPageState: React.Dispatch<
    React.SetStateAction<"edit" | "create" | "upgrade"|"none">
  >;
}) {
  const { token, tenantId } = useUserContext();

  
  const upgrade = () => {
    if (!token || !tenantId) {
      return;
    }
    upgradeMembership(token, tenantId)
      .then((res) => {
        if (res.success && res.code === 200) {
          alert("Note Upgraded Successfully!");
        }
        else{
            alert(res.message);
        }
        setPageState("none");
      })
      .catch((error) => {
        alert("Unable to upgrade plan! \n" + error.message);
        setPageState("none");
      });
  };
  return (
    <div className="absolute top-[50%] left-[50%] translate-[-50%] shadow-2xl shadow-black bg-white rounded-xl p-6 w-[90%] max-w-md">
      <div className="flex justify-end">
        <button
          className="bg-red-600 hover:bg-red-700 transition px-3 py-1 rounded-full text-white font-bold"
          onClick={() => setPageState("none")}
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {/* Free Plan */}
        <div className="border-2 border-blue-300 rounded-xl p-4 shadow hover:shadow-lg transition">
          <h1 className="text-blue-700 text-xl font-bold mb-2">Free Plan</h1>
          <p className="text-gray-600">
            Create up to <span className="font-semibold">3 notes</span> for
            free.
          </p>
        </div>

        {/* Pro Plan */}
        <div className="border-2 border-purple-400 rounded-xl p-4 shadow-lg bg-gradient-to-r from-purple-100 to-purple-200 hover:scale-[1.02] transition">
          <h1 className="text-purple-800 text-xl font-bold mb-2">Pro Plan</h1>
          <p className="text-gray-700">
            Enjoy <span className="font-semibold">unlimited notes</span> and
            unlock all features.
          </p>
        </div>

        {/* Upgrade Button */}
        <button
          onClick={upgrade}
          className="rounded-lg bg-blue-700 hover:bg-blue-800 transition p-3 font-bold text-white mt-2"
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}

export default Plan;
