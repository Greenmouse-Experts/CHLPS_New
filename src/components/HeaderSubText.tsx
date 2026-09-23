import { PropsWithChildren } from "react";

export default function HeaderSubText(
  props: PropsWithChildren<{ textWhite?: boolean; smallWidth?: boolean }>,
) {
  const { textWhite = false, smallWidth = false } = props;
  return (
    <>
      <div
        className={`${textWhite ? "text-white" : "text-primary"} text-center mx-auto max-w-5xl text-base font-medium ${smallWidth ? "max-w-sm" : ""}`}
      >
        {props.children}
      </div>
    </>
  );
}
