import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";

function List() {
  const [{ userInfo, userContacts, filteredContacts }, dispatch] = useStateProvider(); // get the userInfo from the state

  useEffect(() => {
    const getContacts = async () => {
      try {
        const { data: { users, onlineUsers } } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo?.id}`); // get the initial contacts
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers }); // set the online users
        dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts: users }); // set the user contacts
      } catch (err) {
        console.error(err);
      }
    };

    if (userInfo?.id) {
      getContacts(); // call the getContacts
    }
  }, []);

  return (
    <div className="bg-search-input-container-background flex flex-col flex-auto max-h-full custom-scrollbar">
      {filteredContacts && filteredContacts.length > 0 ? (
        filteredContacts.map((contact) => (
          <ChatLIstItem data={contact} key={contact.id} />
        ))
      ) : (
        userContacts.map((contact) => (
          <ChatLIstItem data={contact} key={contact.id} />
        ))
      )
      }
    </div>
  );
}

export default List;
