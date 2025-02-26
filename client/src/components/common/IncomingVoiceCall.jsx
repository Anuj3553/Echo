import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React from "react";

function IncomingVoiceCall() {
  const [{ incomingVoiceCall, socket }, dispatch] = useStateProvider();

  const acceptCall = () => {
    // set the voice call to the incoming voice call
    dispatch({
      type: reducerCases.SET_VOICE_CALL, // set the voice call
      voiceCall: {
        ...incomingVoiceCall, // set the incoming voice call
        type: "in-coming", // set the type to "in-coming"
      },
    });

    // accept-incoming-call event: emit an event to accept the incoming call
    socket.current.emit("accept-incoming-call", { id: incomingVoiceCall.id });

    // dispatch an action to set the incoming voice call
    dispatch({
      type: reducerCases.SET_INCOMING_VOICE_CALL, // set the incoming voice call
      incomingVoiceCall: undefined, // set the incoming voice call
    });
  }

  const rejectCall = () => {
    // reject-incoming-call event: emit an event to reject the incoming call
    socket.current.emit("reject-voice-call", { from: incomingVoiceCall.id });

    // dispatch an action to set the incoming voice call
    dispatch({
      type: reducerCases.END_CALL, // set the incoming voice call
    });
  }

  return (
    <div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14">
      <div>
        <Image
          src={incomingVoiceCall.profilePicture}
          alt="avatar"
          width={70}
          height={70}
          className="rounded-full"
        />
      </div>
      <div>
        <div className="text-xs">{incomingVoiceCall.name}</div>
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

export default IncomingVoiceCall;
