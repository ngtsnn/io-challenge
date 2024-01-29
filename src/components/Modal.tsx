import ModalPortal from '@/atoms/ModalPortal';
import clsx from 'clsx';
import React, { FC, ReactNode } from 'react'

export interface IModal {
  title: string;
  isVisible: boolean;
  className: string;
  onClose: () => unknown;
  children?: ReactNode
}

const Modal: FC<IModal> = ({ isVisible, title, onClose, children, className }) => {
  return (
    <ModalPortal>
      <div
        className={clsx(
          "overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-[1000] justify-center items-center w-full md:inset-0 h-full max-h-full bg-black/60",
          !isVisible && "hidden"
        )}
      >
        <div className="absolute inset-0 m-auto p-4 w-full max-w-2xl max-h-full flex justify-center items-center">
          {/* Modal content */}
          <div className={clsx("relative bg-white rounded-lg shadow dark:bg-gray-700", className)}>
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={onClose}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 md:p-5">{children}</div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default Modal