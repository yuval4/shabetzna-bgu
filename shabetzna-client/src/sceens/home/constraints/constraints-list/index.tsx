import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Constraint } from "../../../../shared/types/entities/constraint";
import StatusIndecator from "../../../../components/status-indecator";
import { weekDay } from "../../../../shared/dates/format-date";
import classNames from "classnames";
import style from "./style.module.css";
import ActionsMenu from "./actions-memu";
import { CONSTRAINT_STATUS } from "../../../../shared/enums/constraint-status";
import { CONSTRAINT_TYPES } from "../../../../shared/enums/constraint-types";
import ListSkeleton from "../../../../components/list-skeleton";
import { useRoles } from "../../../../hooks/use-roles";
import { SHIFT_TYPE } from "../../../../shared/enums/shift-type";

interface Props {
  constraints: Constraint[];
  emptyMessage?: string;
  loading?: boolean;
}

// TODO ellipsis for long text (reason)

const ConstraintsList = ({
  constraints,
  emptyMessage = "אין אילוצים",
  loading = false,
}: Props) => {
  const { hasRoleOrOwnership } = useRoles();

  if (loading) {
    return <ListSkeleton gap={8} itemHeight={30} items={Math.floor(Math.random() * 3) + 2} />;
  }

  if (constraints.length === 0) {
    return <Typography>{emptyMessage}</Typography>;
  }

  return (
    <Table className={style.table}>
      <TableBody>
        {constraints.map((constraint, index) => (
          <TableRow
            key={constraint.id}
            className={classNames(
              index % 2 === 0 ? style.lightRow : style.darkRow,
              style.row
            )}
          >
            <TableCell size="small">
              <StatusIndecator
                title={CONSTRAINT_STATUS[constraint.status]?.label}
                color={CONSTRAINT_STATUS[constraint.status]?.color}
              />
            </TableCell>
            <TableCell>{constraint.user.username}</TableCell>
            <TableCell>{CONSTRAINT_TYPES[constraint.type].label}</TableCell>
            <TableCell>{weekDay(constraint.date)}, {SHIFT_TYPE[constraint.shiftType].label}</TableCell>
            {hasRoleOrOwnership(["SHIFTS_ADMIN", "TEAM_LEADER"], constraint.user.id) && <TableCell>{constraint.reason}</TableCell>}
            <TableCell size="small">
              {
                hasRoleOrOwnership(["SHIFTS_ADMIN", "TEAM_LEADER"], constraint.user.id)
                &&
                <ActionsMenu constraint={constraint} />
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ConstraintsList;
