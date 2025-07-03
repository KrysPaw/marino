import { type PlacesType, Tooltip } from "react-tooltip";

type Props = {
  id: string;
  message: string;
  place?: PlacesType;
  children?: React.ReactNode;
};

export const TooltipWrapper = ({ id, message, place, children }: Props) => {
  return (
    <>
      <Tooltip id={id} delayShow={300} arrowSize={0} style={{ fontSize: 18 }} />
      {/** biome-ignore lint/a11y/useValidAnchor: well, this is not a valid anchor */}
      <a
        data-tooltip-id={id}
        data-tooltip-content={message}
        data-tooltip-place={place ?? "top"}
      >
        {children}
      </a>
    </>
  );
};
