import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";

function MessageBar() {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider(); // Destructure userInfo and currentChatProvider from the state

  const [message, setMessage] = useState(""); // Create a message state variable

  // sendMessage: This is an asynchronous function that sends a message to the server
  const sendMessage = async () => {
    try {
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, { // Send a POST request to the ADD_MESSAGE_ROUTE with the message data
        to: currentChatUser?.id, // Send the message to the current chat user
        from: userInfo?.id, // Send the message from the current user
        message, // Send the message content
      });
      socket.current.emit("send-msg", { // Emit a "send-msg" event to the server with the message data
        to: currentChatUser?.id, // Send the message to the current chat user
        from: userInfo?.id, // Send the message from the current user
        message: data.message, // Send the message data
      });
      dispatch({
        type: reducerCases.ADD_MESSAGE, // Add the message to the messages array
        newMessage: {
          ...data.message // Set the new message
        },
        fromSelf: true, // Set the fromSelf flag to true
      })
      setMessage(""); // Clear the message input field
    }
    catch (err) {
      console.error(err); // Log any errors to the console
    }
  }

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
        <div className="flex gap-6">
          <BsEmojiSmile
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Emoji"
          />
          <ImAttachment
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Attachment"
          />
        </div>
        <div className="w-full rounded-lg h-10 items-center">
          <input
            type="text"
            placeholder="Type a message"
            className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="flex w-10 items-center justify-center">
          <button>
            <MdSend
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Send message"
              onClick={sendMessage}
            />
            {/* <FaMicrophone
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Record"
            /> */}
          </button>
        </div>
      </>
    </div>
  );
}

export default MessageBar;
