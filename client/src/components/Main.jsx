import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/navigation";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import IncomingVoiceCall from "./common/IncomingVoiceCall";

function Main() {
  const router = useRouter();

  const [{ userInfo, currentChatUser, messagesSearch, videoCall, voiceCall, incomingVoiceCall, incomingVideoCall }, dispatch] = useStateProvider(); // useStateProvider is a custom hook that returns the state and dispatch function from the context

  const [redirectLogin, setRedirectLogin] = useState(false); // create a state variable to store the redirectLogin state
  const [socketEvent, setSocketEvent] = useState(false); // create a state variable to store the socketEvent state

  const socket = useRef(); // create a ref to store the socket object

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
        const { id, name, email, profilePicture, status } = data.data; // destructure id, name, email, profilePicture, and status from data.data
        dispatch({
          type: reducerCases.SET_USER_INFO, // set the user info
          userInfo: {
            id, // set the id
            name, // set the name
            email, // set the email
            profilePicture, // set the profile image
            status, // set the status
          },
        });
      }
    }
  });

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST); // create a new socket.io client and connect to the server
      socket.current.emit("add-user", userInfo.id); // emit : means to send a message to the server with the event name "add-user" and the user's ID as the data
      dispatch({ // dispatch an action to set the socket
        type: reducerCases.SET_SOCKET, // set the socket type
        socket // set the socket
      })
    }
  }, [userInfo]); // run this effect when userInfo changes

  useEffect(() => {
    if (socket.current && !socketEvent) { // if the socket is connected and the socketEvent is false
      socket.current.on("msg-receive", (data) => { // listen for the "msg-receive" event
        dispatch({ // dispatch an action to set the messages
          type: reducerCases.ADD_MESSAGE, // set the action type
          newMessage: {
            ...data.message // set the new message
          },
        })
      });

      socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => { // listen for the "incoming-voice-call" event
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL, // set the incoming voice call
          incomingVoiceCall: {
            ...from, // set the incoming voice call
            roomId, // set the room ID
            callType, // set the call type
          }
        })
      });

      socket.current.on("incoming-video-call", ({ from, roomId, callType }) => { // listen for the "incoming-video-call" event
        dispatch({
          type: reducerCases.SET_INCOMING_VIDEO_CALL, // set the incoming video call
          incomingVideoCall: {
            ...from, // set the incoming video call
            roomId, // set the room ID
            callType, // set the call type
          }
        })
      });

      socket.current.on("voice-call-rejected", () => { // listen for the "voice-call-rejected" event
        dispatch({ // dispatch an action to set the incoming voice call
          type: reducerCases.END_CALL, // set the incoming voice call
        })
      });

      socket.current.on("video-call-rejected", () => { // listen for the "video-call-rejected" event
        dispatch({ // dispatch an action to set the incoming video call
          type: reducerCases.END_CALL, // set the incoming video call
        })
      });

      setSocketEvent(true); // set the socketEvent to true
    }
  }, [socket.current])

  useEffect(() => {
    // Function to get messages
    const getMessages = async () => {
      const { data: { messages } } = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo?.id}/${currentChatUser?.id}`);
      dispatch({
        type: reducerCases.SET_MESSAGES, // set the messages
        messages, // set the messages
      });
    }

    if (currentChatUser?.id) { // if the currentChatUser ID is not null
      getMessages(); // call the getMessages function
    }
  }, [currentChatUser]); // run this effect when currentChatUser changes

  return (
    <>
      {incomingVideoCall && (
        <IncomingVideoCall />
      )}

      {incomingVoiceCall && (
        <IncomingVoiceCall />
      )}

      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VideoCall />
        </div>
      )}

      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VoiceCall />
        </div>
      )}

      {!videoCall && !voiceCall && (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-screen">
          <ChatList />
          {currentChatUser ? (
            <div className={messagesSearch ? "grid grid-cols-2" : "grid-cols-1"}>
              <Chat />
              {messagesSearch && <SearchMessages />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </>
  );
}

export default Main;
