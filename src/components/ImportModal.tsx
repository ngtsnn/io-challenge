import React, { ChangeEventHandler, FC, useState } from "react";
import Modal from "./Modal";
import { Editor } from "@monaco-editor/react";
import { array, number, object, string } from "yup";

interface IProps {
  isVisible: boolean;
  onClose: () => unknown;
  onImport: (config: any) => unknown;
}

const WidgetSchema = object({
  id: number().required(),
  name: string().required(),
  state: object().required(),
});

const ConfigSchema = array(WidgetSchema);

export const ImportModal: FC<IProps> = ({ isVisible, onClose, onImport }) => {

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const fileReader = new FileReader();
    const _file = e.target?.files?.[0];
    if (!_file) {
      return;
    }
    fileReader.readAsText(_file, "UTF-8");
    fileReader.onload = async (e) => {
      const jsonRaw = e.target?.result;
      if (!jsonRaw) {
        alert('Error to upload');
        onClose();
        return;
      }
      try {
        const _config = JSON.parse(jsonRaw.toString());
        const res = await ConfigSchema.validate(_config);
        if(res) {
          onImport(_config);
          alert("Uploaded successfully");
          onClose();
          return;
        } else {
          throw new Error("Invalid import chema");
        }
      } catch (error) {
        alert("Invalid import chema");
        onClose();
      }
    };
  };

  return (
    <Modal
      className="w-full h-fit overflow-y-auto"
      title="Import"
      isVisible={isVisible}
      onClose={onClose}
    >
      <input type="file" accept="json" onChange={handleChange} />
    </Modal>
  );
};
