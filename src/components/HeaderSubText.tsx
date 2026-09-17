import { PropsWithChildren } from "react";

export default function HeaderSubText(
  props: PropsWithChildren<{ textWhite?: boolean }>,
) {
  const { textWhite = false } = props;
  return (
    <>
      <div
        className={`${textWhite ? "text-white" : "text-primary"} text-center mx-auto max-w-5xl text-xl font-medium`}
      >
        {props.children}
      </div>
    </>
  );
}
