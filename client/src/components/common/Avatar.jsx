import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

function Avatar({ type, image, setImage }) {
  const [hover, setHover] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCordinates, setContextMenuCordinates] = useState({ x: 0, y: 0 });

  const [grabPhoto, setGrabPhoto] = useState(false); // State to control the visibility of the photo picker
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false); // State to control the visibility of the photo library
  const [showCapturePhoto, setShowCapturePhoto] = useState(false); // State to control the visibility of the capture photo

  // Function to show the context menu
  const showContextMenu = (e) => {
    e.preventDefault(); // Prevent the default behavior of the event
    setContextMenuCordinates({ x: e.pageX, y: e.pageY }); // Set the cordinates of the context menu
    setIsContextMenuVisible(true); // Show the context menu
  }

  useEffect(() => {
    if (grabPhoto) { // Check if the grabPhoto state is true
      const data = document.getElementById("photo-picker"); // Get the file input element
      data.click(); // Click the file input element
      document.body.onfocus = (e) => {
        setGrabPhoto(false); // Set the grabPhoto state to false
      }
    }
  }, [grabPhoto]);

  // Options for the context menu
  const contextMenuOptions = [
    {
      name: "Take Photo", // Option to take a photo
      callback: () => { // Callback function to handle the click event
        setShowCapturePhoto(true); // Set the showCapturePhoto state to true
      }
    },
    {
      name: "Choose From Library", // Option to choose a photo from the library
      callback: () => { // Callback function to handle the click event
        setShowPhotoLibrary(true); // Set the showPhotoLibrary state to true
      }
    },
    {
      name: "Upload Photo", // Option to upload a photo
      callback: () => { // Callback function to handle the click event
        setGrabPhoto(true); // Set the grabPhoto state to true
      },
    },
    {
      name: "Remove Photo", // Option to remove the photo
      callback: () => { // Callback function to handle the click event
        setImage("/default_avatar.png"); // Set the image to the default avatar
      },
    },
  ];

  // Function to handle the change event of the file input
  const photoPickerChange = async (e) => {
    const file = e.target.files[0]; // Get the file from the file input
    const reader = new FileReader(); // Create a new FileReader object
    const data = document.createElement("img"); // Create a new image element

    reader.onload = function (e) { // Add an event listener to listen for the load event
      data.src = e.target.result; // Set the source of the image to the result of the reader
      data.setAttribute("data-src", e.target.result); // Set the data-src attribute of the image to the result of the reader
    };

    reader.readAsDataURL(file); // Read the file as a data URL
    setTimeout(() => {
      console.log(data.src);
      setImage(data.src); // Set the image to the source of the image element
    }, 100); // Set a timeout to wait for the image to load
  }

  return (
    <div className="flex items-center justify-center">
      {type === "sm" && (
        <div className="relative h-10 w-10">
          <Image src={image} alt="avatar" className="rounded-full" fill />
        </div>
      )}
      {type === "lg" && (
        <div className="relative h-14 w-14">
          <Image src={image} alt="avatar" className="rounded-full" fill />
        </div>
      )}

      {type === "xl" && (
        <div
          className="relative cursor-pointer z-0"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div
            className={`z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2 ${hover ? "visible" : "hidden"}`}
            onClick={(e) => showContextMenu(e)}
            id="context-opener"
          >
            <FaCamera
              className="text-2xl"
              onClick={(e) => showContextMenu(e)}
              id="context-opener"
            />
            <span onClick={(e) => showContextMenu(e)} id="context-opener">
              Change <br /> Profile <br /> Photo
            </span>
          </div>
          <div className="flex items-center justify-center h-60 w-60">
            <Image src={image} alt="avatar" className="rounded-full" fill />
          </div>
        </div>
      )}

      {/* Render the context menu */}
      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          cordinates={contextMenuCordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}

      {/* Render the CapturePhoto component */}
      {showCapturePhoto && ( // Check if the showCapturePhoto state is true
        <CapturePhoto
          setImage={setImage} // Pass the setImage function as a prop
          hideCapturePhoto={setShowCapturePhoto} // Pass the setShowCapturePhoto function as a prop
        />
      )}

      {/* Render the PhotoLibrary component */}
      {showPhotoLibrary && ( // Check if the showPhotoLibrary state is true
        <PhotoLibrary
          setImage={setImage} // Pass the setImage function as a prop
          hidePhotoLibrary={setShowPhotoLibrary} // Pass the setShowPhotoLibrary function as a prop
        />
      )}

      {/* Render the PhotoPicker component */}
      {grabPhoto && ( // Check if the grabPhoto state is true
        <PhotoPicker onChange={photoPickerChange} />
      )}
    </div>
  )
}

export default Avatar;
