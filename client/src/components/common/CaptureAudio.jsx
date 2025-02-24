import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

function CaptureAudio({ hide }) {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveform, setWaveform] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState(null);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveFormRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    }
  }, [isRecording]);

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });

    setWaveform(waveSurfer);

    waveSurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      waveSurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveform) {
      handleStartRecording();
    }
  }, [waveform]);

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRecordedAudio(null);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;

        const chunks = []; // Ensure fresh audioChunks

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioURL = URL.createObjectURL(blob);
          const audio = new Audio(audioURL);
          setRecordedAudio(audio);

          waveform.load(audioURL);
        };

        mediaRecorder.start();
      })
      .catch((err) => {
        console.error("Error accessing microphone", err);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveform.stop();

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (e) => {
        audioChunks.push(e.data);
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioURL = new File([audioBlob], "recording.mp3");
        setRenderedAudio(audioURL);
      });
    }
  }

  useEffect(() => {
    if (recordedAudio) {
      const updatedPlaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      }
      recordedAudio.addEventListener("timeupdate", updatedPlaybackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatedPlaybackTime);
      }
    }
  }, [renderedAudio])

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveform.stop();
      waveform.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  }

  const handlePauseRecording = () => {
    waveform.stop();
    recordedAudio.pause();
    setIsPlaying(false);
  };

  const sendRecording = async () => {
    try {
      const formData = new FormData(); // Create a new FormData object
      formData.append("audio", renderedAudio); // Append the file to the FormData object
      const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, { // Send a POST request to the ADD_IMAGE_MESSAGE_ROUTE with the FormData
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

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1 flex items-center">
        <FaTrash
          className="text-panel-header-icon cursor-pointer"
          onClick={() => hide()}
        />
        <div className="mx-4 p-2 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
          {isRecording ? (
            <div className="text-red-500 animate-pulse w-60 text-center">
              Recording <span>{recordingDuration}</span>
            </div>
          ) : (
            <div>
              {recordedAudio &&
                <>
                  {!isPlaying ?
                    (<FaPlay onClick={handlePlayRecording} className="cursor-pointer" />) :
                    (<FaStop onClick={handlePauseRecording} className="cursor-pointer" />)
                  }
                </>
              }
            </div>
          )}
          <div className="w-60" ref={waveFormRef} hidden={isRecording} />
          {recordedAudio && isPlaying && (
            <span>{formatTime(currentPlaybackTime)}</span>
          )
          }
          {recordedAudio && isPlaying && (
            <span>{formatTime(totalDuration)}</span>
          )}
          <audio ref={audioRef} hidden />
        </div>
        <div className="mr-4">
          {!isRecording ? (
            <FaMicrophone className="text-red-500 cursor-pointer" onClick={handleStartRecording} />
          ) : (
            <FaPauseCircle className="text-red-500 cursor-pointer" onClick={handleStopRecording} />
          )}
        </div>
        <div>
          <MdSend
            className="text-panel-header-icon cursor-pointer mr-4"
            title="Send"
            onClick={sendRecording}
          />
        </div>
      </div>
    </div>
  );
}

export default CaptureAudio;
