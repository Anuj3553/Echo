import Image from "next/image";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function login() {
  const router = useRouter(); // get the router object from the useRouter hook

  const [{}, dispatch] = useStateProvider(); // get the state and dispatch from the useStateProvider hook

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider(); // create a new GoogleAuthProvider object
    const {
      user: { displayName: name, email, photoURL: profileImage },
    } = await signInWithPopup(firebaseAuth, provider); // sign in with Google and get the user's name, email, and profile image
    try {
      if (email) { // check if the email exists
        const { data } = await axios.post(CHECK_USER_ROUTE, { email }); // send a POST request to the CHECK_USER endpoint with the user's email

        if (!data.status) {
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: true,
          });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              name,
              email,
              profileImage,
              status: ""
            },
          })
          router.push("/onboarding");
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="flex flex-col justify-center items-center bg-panel-header-background h-screen w-screen">
      <div className="flex items-center justify-center gap-2 text-white">
        <Image src="/whatsapp.gif" alt="Whatsapp" height={300} width={300} />
        <span className="text-7xl">Whatsapp</span>
      </div>
      <button className="flex items-center gap-7 bg-search-input-container-background p-5 rounded-lg mt-4" onClick={handleLogin}>
        <FcGoogle className="text-4xl" />
        <span className="text-white text-2xl">Login with Google</span>
      </button>
    </div>
  );
}

export default login;
