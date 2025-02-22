import React, { useEffect, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/navigation";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import Chat from "./Chat/Chat";

function Main() {
  const router = useRouter();

  const [{ userInfo, currentChatUser }, dispatch] = useStateProvider(); // useStateProvider is a custom hook that returns the state and dispatch function from the context
  const [redirectLogin, setRedirectLogin] = useState(false);

  useEffect(() => {
    if (redirectLogin) { // if redirectLogin is true, redirect to login page
      router.push("/login"); // redirect to login page
    }
  }, [redirectLogin]) // run this effect when redirectLogin changes

  // onAuthStateChanged is a function that listens for changes in the authentication state
  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) { // if currentUser is null, set redirectLogin to true
      setRedirectLogin(true); // set redirectLogin to true
    }
    if (!userInfo && currentUser?.email) { // if userInfo is null and currentUser.email is not null
      const { data } = await axios.post(CHECK_USER_ROUTE, { email: currentUser.email });
      if (data.status) {
        router.push("/login");
      }

      if (data?.data) {
        const { id, name, email, profileImage, status } = data.data; // destructure id, name, email, profileImage, and status from data.data
        dispatch({
          type: reducerCases.SET_USER_INFO, // set the user info
          userInfo: {
            id, // set the id
            name, // set the name
            email, // set the email
            profileImage, // set the profile image
            status, // set the status
          },
        });
      }
    }
  })

  return (
    <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-screen">
      <ChatList />
      {currentChatUser ?
        <Chat /> :
        <Empty />
      }
    </div>
  );
}

export default Main;
