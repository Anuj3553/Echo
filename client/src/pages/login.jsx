import Image from "next/image";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { CHECK_USER } from "@/utils/ApiRoutes";
import axios from "axios";
import { useRouter } from "next/navigation";

function login() {
  const router = useRouter();
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const {
      user: { displayName: name, email, photoURL: profileImage },
    } = await signInWithPopup(firebaseAuth, provider);
    try {
      if (email) {
        const { data } = await axios.post(CHECK_USER, { email });
        console.log(data);
        if (!data.status) {
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
