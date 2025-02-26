import React, { useEffect, useRef } from "react";

function ContextMenu({ options, cordinates, contextMenu, setContextMenu }) {
  const contextMenuRef = useRef(null);

  useEffect(() => {
    // Add event listener to listen for clicks outside the context menu
    const handleOutsideClick = (e) => {
      if (e.target.id !== "context-opener") { // Check if the target is not the context menu opener
        // Check if the click is outside the context menu and close the context menu
        if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) { 
          setContextMenu(false);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick); // Add the event listener to the document
  }, []);

  // Add event listener to listen for clicks outside the context menu
  const handleClick = (e, callback) => {
    e.stopPropagation(); // Stop the event from bubbling up
    callback(); // Call the callback function
    setContextMenu(false); // Close the context menu
  }

  return (
    <div
      className={`bg-dropdown-background fixed py-2 z-[100] shadow-xl`}
      ref={contextMenuRef}
      style={{
        top: cordinates.y, // Set the top position of the context menu
        left: cordinates.x, // Set the left position of the context menu
      }}
    >
      <ul>
        {options.map(({ name, callback }) => ( // Map through the options and render them
          <li
            key={name} // Set the key to the name of the option
            onClick={(e) => handleClick(e, callback)} // Add an onClick event listener to the option
            className="px-5 py-2 cursor-pointer hover:bg-background-default-hover z-50"
          >
            <span className="text-white">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ContextMenu;
