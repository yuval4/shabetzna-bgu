import { Tooltip } from "@mui/material";
import style from "./style.module.css";
import classNames from "classnames";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  disabled?: boolean;
  reason?: string;
  className?: string;
}

const Disable = ({
  children,
  disabled = true,
  reason = "",
  className,
  ...props
}: Props) => {
  return (
    <Tooltip title={disabled && reason}>
      <span
        className={classNames({ [style.disabled]: disabled }, className)}
        {...props}
      >
        <span className={classNames({ [style.disableEvents]: disabled })}>
          {children}
        </span>
      </span>
    </Tooltip>
  );
};

export default Disable;
