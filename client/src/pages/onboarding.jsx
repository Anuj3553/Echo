import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function onboarding() {
  const router = useRouter();

  const [{ userInfo, newUser }, dispatch] = useStateProvider();
  const [name, setName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState(userInfo?.profileImage ||"/default_avatar.png");

  // Check if the user is already onboarded
  useEffect(() => {
    if (!newUser && !userInfo?.email) { // If the user is not new and the user info does not exist
      router.push("/login"); // Redirect the user to the login page
    }
    else if (!newUser && userInfo?.email) { // If the user is not new and the user info exists
      router.push("/"); // Redirect the user to the home page
    }
  }, [newUser, userInfo, router]) // Add newUser, userInfo, and router to the dependency array

  // Function to onboard the user
  const onboardUserHandler = async () => {
    // Check if the user details are valid
    if (validateDetails()) {
      const email = userInfo.email; // Get the email from the user info
      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          about,
          image,
        })

        if (data.status) {
          dispatch({ // dispatch an action to set the new user to true
            type: reducerCases.SET_NEW_USER, // set the action type to SET_NEW_USER
            newUser: false, // set the newUser property to true
          });
          dispatch({ // dispatch an action to set the user info
            type: reducerCases.SET_USER_INFO, // set the action type to SET_USER_INFO
            userInfo: {
              id: data.id, // set the id property to the user's id
              name, // set the name property to the user's name
              email, // set the email property to the user's email
              profileImage: image, // set the profileImage property to the user's profile image
              status: "" // set the status property to an empty string
            },
          });
          router.push("/");
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  const validateDetails = () => {
    if (name.length < 3) {
      return false;
    }
    return true;
  }

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <Image
          src="/whatsapp.gif"
          alt="whatsapp"
          width={300}
          height={300}
          priority
        />
        <span className="text-7xl">Whatsapp</span>
      </div>
      <h2 className="text-2xl">Create your profile</h2>
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
          <Input name="Display Name" state={name} setState={setName} label />
          <Input name="About" state={about} setState={setAbout} label />
          <div className="flex items-center justify-center">
            <button
              className="flex items-center gap-7 bg-search-input-container-background p-5 rounded-lg mt-4"
              onClick={onboardUserHandler}
            >
              Create Profile
            </button>
          </div>
        </div>
        <div>
          <Avatar type="xl" image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  )
}

export default onboarding;
