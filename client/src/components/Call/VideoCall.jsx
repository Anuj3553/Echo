import React, { useEffect } from "react"; // import the React module
import dynamic from "next/dynamic"; // import the dynamic function from next/dynamic
import { useStateProvider } from "@/context/StateContext"; // import the useStateProvider function from the StateContext
const Container = dynamic(() => import("./Container"), { ssr: false }); // import the Container component using dynamic import

function VideoCall() {
  const [{ videoCall, socket, userInfo }, dispatch] = useStateProvider(); // get the videoCall, socket, and userInfo from the state

  useEffect(() => {
    if (videoCall.type === "out-going") {
      socket.current.emit("outgoing-video-call", {
        to: videoCall.id,
        from: {
          id: userInfo.id,
          profilePicture: userInfo.profilePicture,
          name: userInfo.name,
        },
        callType: videoCall.callType,
        roomId: videoCall.roomId,
      })
    }
  }, [videoCall]);

  return (
    <Container data={videoCall} />
  );
}

export default VideoCall;
