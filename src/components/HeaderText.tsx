import { Reveal } from "@/features/components/reveal";

export default function HeaderText(props: {
  left: string;
  right?: string;
  textWhite?: boolean;
  switch?: boolean;
  smallSize?: boolean;
  notUppercase?: boolean;
  notCenter?: boolean;
  bold?: boolean;
}) {
  const {
    textWhite = false,
    notCenter = false,
    smallSize,
    notUppercase = false,
    bold = true,
  } = props;
  return (
    <>
      <Reveal delay={80}>
        <h2
          className={`${textWhite ? "text-white" : !props.switch ? "text-primary" : "text-secondary"} ${props.notUppercase ? "" : "uppercase"}  xl:font-5xl font-bold ${!notCenter ? "text-center" : ""} ${smallSize ? "text-lg" : "text-3xl"}  `}
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
