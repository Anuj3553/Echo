import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

function CapturePhoto({ hideCapturePhoto, setImage }) {
  const videoRef = useRef(null); // Create a reference for the video element

  useEffect(() => {
    let stream;
    const startCamera = async () => {
      stream = await navigator.mediaDevices.getUserMedia({ // Get the user's media devices
        video: true, // Enable video
        audio: false, // Disable audio
      })
      videoRef.current.srcObject = stream; // Set the video source to the stream
    }
    startCamera(); // Start the camera
    return () => {
      stream?.getTracks().forEach((track) => track.stop()); // Stop the tracks
    }
  })

  // Function to capture a photo
  const capturePhoto = () => {
    const canvas = document.createElement("canvas"); // Create a canvas element
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, 300, 150); // Draw the video frame on the canvas
    setImage(canvas.toDataURL("image/jpeg")); // Set the image to the captured photo
    hideCapturePhoto(false); // Hide the capture photo component
  }

  return (
    <div className="absolute h-4/6 w-2/6 top-1/4 left-1/3 bg-gray-900 gap-3 rounded-lg pt-2 flex items-center justify-center">
      <div className="flex flex-col gap-4 w-full items-center justify-center">
        <div
          className="cursor-pointer flex items-end justify-end"
          onClick={() => hideCapturePhoto(false)}
        >
          <IoClose className="h-10 w-10 cursor-pointer" />
        </div>
        <div className="flex justify-center">
          <video id="video" width={400} autoPlay ref={videoRef}></video>
        </div>
        <button
          className="h-16 w-16 bg-white rounded-full cursor-pointer border-8 border-teal-light p-2 mb-10"
          onClick={capturePhoto}
        >

        </button>
      </div>
    </div>
  );
}

export default CapturePhoto;
