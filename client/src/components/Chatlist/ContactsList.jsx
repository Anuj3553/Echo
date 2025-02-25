import { reducerCases } from "@/context/constants"; // Import the reducerCases object
import { useStateProvider } from "@/context/StateContext"; // Import the useStateProvider object
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes"; // Import the GET_ALL_CONTACTS variable
import axios from "axios"; // Import the axios module
import React, { useEffect, useState } from "react"; // Import the useEffect and useState hooks
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi"; // Import the BiArrowBack component
import ChatLIstItem from "./ChatLIstItem";

function ContactsList() {
  const [allContacts, setAllContacts] = useState([]); // Define the allContacts variable
  const [searchTerm, setSearchTerm] = useState(""); // Define the searchTerm variable
  const [searchContacts, setSearchContacts] = useState([]); // Define the searchContacts variable
  const [{ }, dispatch] = useStateProvider(); // Define the dispatch variable

  useEffect(() => {
    if (searchTerm.length) { // Check if the searchTerm length is greater than 0
      const filteredData = {}; // Define the filteredData variable
      // Loop through the allContacts object
      Object.keys(allContacts).forEach((key) => {
        // Filter the data based on the search term
        filteredData[key] = allContacts[key].filter((obj) => obj.name.toLowerCase().includes(searchTerm.toLowerCase()));
      })
      setSearchContacts(filteredData); // Set the searchContacts variable to the filteredData variable
    } else {
      setSearchContacts(allContacts); // Set the searchContacts variable to the allContacts variable
    }
  }, [searchTerm]); // Add the searchTerm as a dependency

  // Define the getContacts function
  useEffect(() => {
    const getContacts = async () => {
      try {
        // Define the getContacts function
        const { data: { users }, } = await axios.get(GET_ALL_CONTACTS); // Define the data variable
        setAllContacts(users); // Set the allContacts variable to the users variable
        setSearchContacts(users); // Set the searchContacts variable to the users variable
      } catch (error) {
        console.log(error); // Log the error
      }
    };

    getContacts(); // Call the getContacts function
  }, []); // Add an empty dependency array

  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() => dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE })}
          />
          <span>New Chat</span>
        </div>
      </div>
      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 h-14">
          <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
            </div>
            <div>
              <input
                type="text"
                placeholder="Search Contacts"
                className="bg-transparent text-sm focus:outline-none text-white w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        {Object.entries(searchContacts).map(([initialLetter, userList]) => {
          return (
            userList.length > 0 &&
            <div key={Date.now() + initialLetter}>
              <div className="text-teal-light pl-10 py-5">{initialLetter}</div>
              {
                userList.map(contact => {
                  return (
                    <ChatLIstItem
                      data={contact}
                      isContactsPage={true}
                      key={contact.id}
                    />
                  )
                })
              }
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default ContactsList;
