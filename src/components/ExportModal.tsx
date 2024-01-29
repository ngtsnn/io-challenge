import React, { FC } from "react";
import Modal from "./Modal";
import { Editor } from "@monaco-editor/react";

interface IProps {
  isVisible: boolean;
  onClose: () => unknown;
  config: object[];
}

export const ExportModal: FC<IProps> = ({ isVisible, onClose, config }) => {
  const jsonConfig = JSON.stringify(config, null, 2);

  const onCopy = () => {
    navigator.clipboard.writeText(jsonConfig);
    alert("Copied");
  };

  const download = () => {
    const filename = "config.json";
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(jsonConfig));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  return (
    <Modal
      className="w-full h-fit overflow-y-auto"
      title="Export"
      isVisible={isVisible}
      onClose={onClose}
    >
      <div className="flex justify-end space-x-2">
        <svg
          onClick={onCopy}
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-copy cursor-pointer"
        >
          <rect x={9} y={9} width={13} height={13} rx={2} ry={2} />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>

        <svg
          onClick={download}
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          fill="currentColor"
          className="bi bi-download cursor-pointer"
          viewBox="0 0 16 16"
        >
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
        </svg>
      </div>
      <div className="h-2"></div>
      <Editor height={500} language="json" value={jsonConfig} className="h-full" />
    </Modal>
  );
};
