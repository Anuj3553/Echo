import React from "react";
import ReactDOM from "react-dom";

function PhotoPicker({ onChange }) {
  // Function to handle the change event of the file input
  const component = (
    <input type="file" hidden id="photo-picker" onChange={onChange} />
  );

  return ReactDOM.createPortal( // Render the component in a portal to avoid styling conflicts with the parent component
    component, // The component
    document.getElementById("photo-picker-element") // The element to render the component in
  );
}

export default PhotoPicker;
