import { Reveal } from "@/features/components/reveal";

export default function HeaderText(props: {
  left: string;
  right?: string;
  textWhite?: boolean;
  switch?: boolean;
}) {
  const { textWhite = false } = props;
  return (
    <>
      <Reveal delay={80}>
        <h2
          className={`${textWhite ? "text-white" : !props.switch ? "text-primary" : "text-secondary"} uppercase text-4xl xl:font-5xl font-bold `}
        >
          {props.left}{" "}
          {props.right && (
            <span className={!props.switch ? "text-secondary" : "text-primary"}>
              {props.right}
            </span>
          )}
        </h2>
      </Reveal>
    </>
  );
}
