import { Tooltip } from "@mui/material";
import { CONSTRAINT_STATUS } from "../../shared/enums/constraint-status";
import style from "./style.module.css";

interface Props {
  title?: string;
  color?: string;
}

const StatusIndecator = ({
  title = "",
  color = CONSTRAINT_STATUS.PENDING.color,
}: Props) => {
  return (
    <Tooltip title={title}>
      <div className={style.dot} style={{ backgroundColor: color }}></div>
    </Tooltip>
  );
};

export default StatusIndecator;
