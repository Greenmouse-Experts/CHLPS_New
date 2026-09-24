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
  marginBottom?: boolean;
}) {
  const {
    textWhite = false,
    notCenter = false,
    smallSize,
    notUppercase = false,
    bold = true,
    marginBottom = true,
  } = props;
  return (
    <>
      <Reveal delay={80}>
        <h2
          className={`${textWhite ? "text-white" : !props.switch ? "text-primary" : "text-secondary"} ${props.notUppercase ? "" : "uppercase"}  xl:font-5xl ${bold ? "font-bold" : ""} ${!notCenter ? "text-center" : ""} ${smallSize ? "text-lg" : "text-xl lg:text-3xl"}  ${marginBottom ? "mb-3" : ""}`}
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
