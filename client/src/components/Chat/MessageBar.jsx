import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import PhotoPicker from "../common/PhotoPicker";
import dynamic from "next/dynamic";
const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), { ssr: false });

function MessageBar() {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider(); // Destructure userInfo and currentChatProvider from the state

  const [message, setMessage] = useState(""); // Create a message state variable
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Create a showEmojiPicker state variable
  const [grabPhoto, setGrabPhoto] = useState(false); // Create a grabPhoto state variable
  const [showAudioRecorder, setShowAudioRecorder] = useState(false); // Create a showAudioRecorder state variable

  const emojiPicker = useRef(null); // Create a ref for the emoji picker

  // Function to handle the change event of the file input
  const photoPickerChange = async (e) => {
    e.preventDefault(); // Prevent the default behavior of the event
    try {
      const file = (e.target.files[0]); // Get the file from the file input
      const formData = new FormData(); // Create a new FormData object
      formData.append("image", file); // Append the file to the FormData object
      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, { // Send a POST request to the ADD_IMAGE_MESSAGE_ROUTE with the FormData
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
        },
        params: { // Set the query parameters
          from: userInfo?.id, // Set the from field to the current user id
          to: currentChatUser?.id, // Set the to field to the current chat user id
        },
      });
      console.log("response", response); // Log the response to the console
      if (response.status === 201) {
        socket.current.emit("send-msg", { // Emit a "send-msg" event to the server with the message data
          to: currentChatUser?.id, // Send the message to the current chat user
          from: userInfo?.id, // Send the message from the current user
          message: response.data.message, // Send the message data
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE, // Add the message to the messages array
          newMessage: {
            ...response.data.message // Set the new message
          },
          fromSelf: true, // Set the fromSelf flag to true
        })
      }
    } catch (err) {
      console.error(err); // Log any errors to the console
    }
  }

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

  // useEffect: This hook is used to open the file input when the grabPhoto state is true
  useEffect(() => {
    if (grabPhoto) { // Check if the grabPhoto state is true
      const fileInput = document.getElementById("photo-picker"); // Get the file input element
      if (fileInput) { // Check if the file input element exists
        fileInput.click(); // Click the file input element
      }

      const handleFileChange = () => {
        setTimeout(() => setGrabPhoto(false), 1000); // Delay to ensure selection
      };

      fileInput?.addEventListener("change", handleFileChange); // Add an event listener for the "change" event

      return () => {
        fileInput?.removeEventListener("change", handleFileChange); // Remove the event listener when the component unmounts
      };
    }
  }, [grabPhoto]); // Run this effect whenever the grabPhoto state changes

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      {
        !showAudioRecorder && (
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
                title="Attach File"
                onClick={() => setGrabPhoto(true)}
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
                {message.length ?
                  (
                    <MdSend
                      className="text-panel-header-icon cursor-pointer text-xl"
                      title="Send message"
                      onClick={sendMessage}
                    />
                  ) : (
                    <FaMicrophone
                      className="text-panel-header-icon cursor-pointer text-xl"
                      title="Record"
                      onClick={() => setShowAudioRecorder(true)}
                    />
                  )}
              </button>
            </div>
          </>
        )}
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
    </div>
  );
}

export default MessageBar;
