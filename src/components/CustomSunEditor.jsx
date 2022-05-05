import React from "react";
import SunEditor from "suneditor-react";

const CustomSunEditor = ({ setInputs, inputs, name }) => {
  const BUTTONLIST = [
    ["undo", "redo"],
    ["fontSize", "formatBlock"],
    ["bold", "underline", "italic", "strike"],
    // ["removeFormat"],
    ["fontColor"],
    ["list", "table"],
    ["link", "image"],
  ];

  const handleChange = (content) => {
    // console.log(content); //Get Content Inside Editor
    setInputs({ ...inputs, [name]: content });
  };

  return (
    <SunEditor
      onChange={handleChange}
      setOptions={{
        buttonList: BUTTONLIST,
        height: "10vh",
      }}
    />
  );
};

export default CustomSunEditor;
