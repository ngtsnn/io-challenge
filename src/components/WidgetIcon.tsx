/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

interface IWidgetIcon extends HTMLAttributes<HTMLDivElement> {
  name: string,
  thumb: string,

}

export const WidgetIcon: FC<IWidgetIcon> = ({ name, thumb, className, ...rest }) => {
    return (
      <div
        className={clsx(
          "w-full flex flex-col space-y-1 cursor-grab active:cursor-grabbing",
          className
        )}
        element-name={name}
        {...rest}
      >
        <img
          src={thumb}
          alt={name}
          width={96}
          height={96}
          className="w-24 h-24 object-cover"
          draggable={false}
        />
        <span className="text-xs text-center">{name}</span>
      </div>
    );
};
