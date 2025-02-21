import Image from "next/image";
import React, { useEffect } from "react";
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

  const [{ userInfo, newUser }, dispatch] = useStateProvider(); // get the state and dispatch from the useStateProvider hook

  useEffect(() => { // check if the user is already logged in
    if (userInfo?.id && !newUser) { // if the user is not new and the user info exists
      router.push("/"); // redirect the user to the home page
    }
  }, [newUser, userInfo, router]); // add newUser, userInfo, and router to the dependency array

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider(); // create a new GoogleAuthProvider object
    const {
      user: { displayName: name, email, photoURL: profileImage },
    } = await signInWithPopup(firebaseAuth, provider); // sign in with Google and get the user's name, email, and profile image
    try {
      if (email) { // check if the email exists
        const { data } = await axios.post(CHECK_USER_ROUTE, { email }); // send a POST request to the CHECK_USER endpoint with the user's email

        // check if the user exists
        if (!data.status) {
          dispatch({ // dispatch an action to set the new user to true
            type: reducerCases.SET_NEW_USER, // set the action type to SET_NEW_USER
            newUser: true, // set the newUser property to true
          });
          dispatch({ // dispatch an action to set the user info
            type: reducerCases.SET_USER_INFO, // set the action type to SET_USER_INFO
            userInfo: {
              name, // set the name property to the user's name
              email, // set the email property to the user's email
              profileImage, // set the profileImage property to the user's profile image
              status: "" // set the status property to an empty string
            },
          });
          router.push("/onboarding");
        } else {
          const { id, name, email, profilePicture: profileImage, status } = data

          dispatch({ // dispatch an action to set the user info
            type: reducerCases.SET_USER_INFO, // set the action type to SET_USER_INFO
            userInfo: {
              id, // set the id property to the user's id
              name, // set the name property to the user's name
              email, // set the email property to the user's email
              profileImage, // set the profileImage property to the user's profile image
              status // set the status property to the user's status
            },
          });
          router.push("/");
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="flex flex-col justify-center items-center bg-panel-header-background h-screen w-screen">
      <div className="flex items-center justify-center gap-2 text-white">
        <Image src="/whatsapp.gif" alt="Whatsapp" height={300} width={300} priority />
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
