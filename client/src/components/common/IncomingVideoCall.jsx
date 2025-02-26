import React from "react";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import { reducerCases } from "@/context/constants";

function IncomingVideoCall() {
  const [{ incomingVideoCall, socket }, dispatch] = useStateProvider();

  const acceptCall = () => {
    // set the video call to the incoming video call
    dispatch({
      type: reducerCases.SET_VIDEO_CALL, // set the video call
      videoCall: {
        ...incomingVideoCall, // set the incoming video call
        type: "in-coming", // set the type to "in-coming"
      },
    });

    // accept-incoming-call event: emit an event to accept the incoming call
    socket.current.emit("accept-incoming-call", { id: incomingVideoCall.id });

    // dispatch an action to set the incoming video call
    dispatch({
      type: reducerCases.SET_INCOMING_VIDEO_CALL, // set the incoming video call
      incomingVideoCall: undefined, // set the incoming video call
    });
  }

  const rejectCall = () => {
    // reject-incoming-call event: emit an event to reject the incoming call
    socket.current.emit("reject-video-call", { from: incomingVideoCall.id });

    // dispatch an action to set the incoming video call
    dispatch({
      type: reducerCases.END_CALL, // set the incoming video call
    });
  }

  return (
    <div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14">
      <div>
        <Image
          src={incomingVideoCall.profilePicture}
          alt="avatar"
          width={70}
          height={70}
          className="rounded-full"
        />
      </div>
      <div>
        <div className="text-xs">{incomingVideoCall.name}</div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={acceptCall}
            className="bg-green-500 p-1 px-3 text-sm rounded-full"
          >
            Accept
          </button>
          <button
            onClick={rejectCall}
            className="bg-red-500 p-1 px-3 text-sm rounded-full"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingVideoCall;
