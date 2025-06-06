import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function logout() {
  const router = useRouter();
  const [{ socket, userInfo }, dispatch] = useStateProvider();

  useEffect(() => {
    socket.current.emit("signout", userInfo?.id);
    dispatch({ type: reducerCases.SET_USER_INFO, userInfo: undefined });
    signOut(firebaseAuth);
    router.push("/login");
  }, [socket]);

  return (
    <div className="bg-conversation-panel-background">

    </div>
  );
}

export default logout;
