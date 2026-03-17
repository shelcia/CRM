import React from "react";
import { SerializedEditorState } from "lexical";
import { Editor } from "@/components/blocks/editor-00/editor";

interface CustomSunEditorProps {
  setInputs: (inputs: any) => void;
  inputs: any;
  name: string;
}

const CustomSunEditor = ({ setInputs, inputs, name }: CustomSunEditorProps) => {
  return (
    <Editor
      onSerializedChange={(value: SerializedEditorState) => {
        setInputs({ ...inputs, [name]: JSON.stringify(value) });
      }}
    />
  );
};

export default CustomSunEditor;
