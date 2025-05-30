import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

function ChatLIstItem({ data, isContactsPage = false }) {
  const [{ userInfo, currentChatUser }, dispatch] = useStateProvider(); // get the userInfo and currentChatUser from the state

  // create a function called handleContactClick that checks if the currentChatUser is the same as the data
  const handleContactClick = () => {
    // if (currentChatUser?._id === data?._id) { // check if the currentChatUser is the same as the data
    if (!isContactsPage) {
      dispatch({ // dispatch an action to change the contactsPage
        type: reducerCases.CHANGE_CURRENT_CHAT_USER, // set the action type to SET_ALL_CONTACTS_PAGE
        user: {
          name: data?.name,
          about: data?.about,
          profilePicture: data?.profilePicture,
          email: data?.email,
          id: userInfo?.id === data.senderId ? data.receiverId : data.senderId,
        }
      });
    } else {
      dispatch({ // dispatch an action to change the contactsPage
        type: reducerCases.CHANGE_CURRENT_CHAT_USER, // set the action type to CHANGE_CURRENT_CHAT_USER
        user: { ...data }, // set the user property to the data and ...data spreads the data object into a new object
      })
      dispatch({ // dispatch an action to change the contactsPage
        type: reducerCases.SET_ALL_CONTACTS_PAGE, // set the action type to SET_ALL_CONTACTS_PAGE
      });
    }
    // }
  };

  return (
    <div className={`flex cursor-pointer items-center hover:bg-background-default-hover`}
      onClick={handleContactClick}
    >
      <div className="min-w-fit px-5 pt-3 pb-1">
        <Avatar type="lg" image={data?.profilePicture} />
      </div>
      <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
        <div className="flex justify-between">
          <div>
            <span className="text-white">{data?.name}</span>
          </div>
          {!isContactsPage && (
            <div>
              <span className={`${!data.totalUnreadMessages > 0 ? "text-secondary" : "text-icon-green"} text-sm`}>
                {calculateTime(data?.createdAt)}
              </span>
            </div>
          )}
        </div>
        <div className="flex border-b border-conversation-border pb-2 pt-1 p3-2">
          <div className="flex justify-between w-full">
            <span className="text-secondary line-clamp-1 text-sm">
              {isContactsPage ? data?.about || "\u00A0" :
                <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]">
                  {data.senderId === userInfo.id && (
                    <MessageStatus messageStatus={data.messageStatus} />
                  )}
                  {data.type === "text" && (
                    <span className="truncate">
                      {data.message}
                    </span>
                  )}
                  {data.type === "audio" && (
                    <span className="flex gap-1 items-center">
                      <FaMicrophone className="text-panel-header-icon" />
                      Audio
                    </span>
                  )}
                  {data.type === "image" && (
                    <span className="flex gap-1 items-center">
                      <FaCamera className="text-panel-header-icon" />
                      Image
                    </span>
                  )}
                </div>
              }
            </span>
            {data.totalUnreadMessages > 0 && (
              <span className="bg-icon-green px-[5px] rounded-full text-sm">
                {data.totalUnreadMessages}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatLIstItem;
