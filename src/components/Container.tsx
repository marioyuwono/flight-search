import React from "react";

interface IContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container(props: Readonly<IContainerProps>) {
  return (
    <div
      className={`container px-8 mx-auto xl:px-0 ${
        props.className ? props.className : ""
      }`}>
      {props.children}
    </div>
  );
}

