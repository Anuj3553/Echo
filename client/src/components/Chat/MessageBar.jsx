import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";

function MessageBar() {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider(); // Destructure userInfo and currentChatProvider from the state

  const [message, setMessage] = useState(""); // Create a message state variable
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Create a showEmojiPicker state variable

  const emojiPicker = useRef(null); // Create a ref for the emoji picker

  // useEffect: This hook is used to listen for clicks outside the emoji picker
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.id !== "emoji-open") { // If the target id is not "emoji-open"
        if (emojiPicker.current && !emojiPicker.current.contains(e.target)) { // If the emojiPicker ref exists and the target is not inside the emojiPicker
          setShowEmojiPicker(false); // Close the emoji picker
        }
      }
    }

    document.addEventListener("click", handleClickOutside); // Add an event listener for the "click" event

    return () => {
      document.removeEventListener("click", handleClickOutside); // Remove the event listener when the component unmounts
    }
  }, []); // Run this effect only once

  // handleEmojiModal: This function toggles the showEmojiPicker state
  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker); // Toggle the showEmojiPicker state
  }

  // handleEmojiClick: This function appends the selected emoji to the message input field
  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => (prevMessage + emoji.emoji)); // Append the emoji to the message input field
  }

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
            id="emoji-open"
            onClick={handleEmojiModal}
          />

          {/* render the EmojiPicker component */}
          {showEmojiPicker && ( // If showEmojiPicker is true, render the EmojiPicker component
            <div
              ref={emojiPicker}
              className="absolute bottom-24 left-16 z-40"
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
            </div>
          )}

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
