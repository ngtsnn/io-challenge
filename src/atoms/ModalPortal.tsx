import { PORTAL_MODAL_ID } from "@/configs/constants";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ModalPortal: FC<PropsWithChildren> = ({ children }) => {
  const [portalElement, setElement] = useState<HTMLElement>();

  useEffect(() => {
    const element = document.getElementById(PORTAL_MODAL_ID);
    if (element) {
      setElement(element);
    }
  }, []);
  return portalElement ? createPortal(children, portalElement) : null;
};

export default ModalPortal
