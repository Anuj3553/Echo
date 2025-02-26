import React, { useEffect } from "react"; // import the React module
import dynamic from "next/dynamic"; // import the dynamic function from next/dynamic
import { useStateProvider } from "@/context/StateContext"; // import the useStateProvider function from the StateContext
const Container = dynamic(() => import("./Container"), { ssr: false }); // import the Container component using dynamic import

function VoiceCall() {
  const [{ voiceCall, socket, userInfo }, dispatch] = useStateProvider(); // get the videoCall, socket, and userInfo from the state

  useEffect(() => {
    if (voiceCall.type === "out-going") {
      socket.current.emit("outgoing-voice-call", {
        to: voiceCall.id,
        from: {
          id: userInfo.id,
          profilePicture: userInfo.profilePicture,
          name: userInfo.name,
        },
        callType: voiceCall.callType,
        roomId: voiceCall.roomId,
      })
    }
  }, [voiceCall]);

  return (
    <Container data={voiceCall} />
  );
}

export default VoiceCall;
