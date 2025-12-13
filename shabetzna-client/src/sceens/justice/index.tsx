import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { useContext, useMemo } from "react";
import style from "./style.module.css";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { getJusticeOfTeam } from "../../queries/teams";
import { TeamContext } from "../../context/team-context";
import { columns } from "./model";

const Justice = () => {
  const { selectedTeam } = useContext(TeamContext);
  const { data: users } = getJusticeOfTeam(selectedTeam.id);

  const getConditionalFormattingColor = (
    value: number,
    maxValue: number,
    minValue: number
  ) => {
    const range = maxValue - minValue;

    const a = "#EB5757";
    const b = "#F2994A";
    const c = "#F2C94C";
    const d = "#27AE60";
    const e = "#618cd2";

    if (value <= minValue + range * 0.2) {
      return a;
    }
    if (value <= minValue + range * 0.4) {
      return b;
    }
    if (value <= minValue + range * 0.6) {
      return c;
    }
    if (value <= minValue + range * 0.8) {
      return d;
    }
    return e;
  };

  const maxPoints = 10;
  const minPoints = 0;
  const totalMaxPoints = 100;
  const totalMinPoints = 0;

  // const maxPoints = useMemo(() => {
  //   return Math.max(
  //     ...users.map((user) =>
  //       Math.max(
  //         ...Object.entries(user.points).map(([key, value]) => {
  //           if (key !== "total") {
  //             return value;
  //           }
  //           return -Infinity;
  //         })
  //       )
  //     )
  //   );
  // }, [users]);

  // const minPoints = useMemo(() => {
  //   return Math.min(
  //     ...users.map((user) =>
  //       Math.min(
  //         ...Object.entries(user.points).map(([key, value]) => {
  //           if (key !== "total") {
  //             return value;
  //           }
  //           return Infinity;
  //         })
  //       )
  //     )
  //   );
  // }, [users]);

  // const totalMaxPoints = useMemo(() => {
  //   return Math.max(
  //     ...users.map((user) =>
  //       Math.max(
  //         ...Object.entries(user.points).map(([key, value]) => {
  //           if (key === "total") {
  //             return value;
  //           }
  //           return -Infinity;
  //         })
  //       )
  //     )
  //   );
  // }, [users]);

  // const totalMinPoints = useMemo(() => {
  //   return Math.min(
  //     ...users.map((user) =>
  //       Math.min(
  //         ...Object.entries(user.points).map(([key, value]) => {
  //           if (key === "total") {
  //             return value;
  //           }
  //           return Infinity;
  //         })
  //       )
  //     )
  //   );
  // }, [users]);

  const getBackgourndColor = (columnName: string, value: number) => {
    if (columnName !== "name") {
      if (columnName === "points.total") {
        return getConditionalFormattingColor(
          value,
          totalMaxPoints,
          totalMinPoints
        );
      }
      return getConditionalFormattingColor(value, maxPoints, minPoints);
    }
  };


  return (
    <Box className={style.container}>
      <Typography variant="subtitle1">טבלת צדק</Typography>
      <Table className={style.table}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={`${column.name}${column.label}`}>
                {column.name === "points.total" ? (
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {column.label}
                    <Tooltip title="הסבר">
                      <HelpOutlineIcon />
                    </Tooltip>
                  </span>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((row, index) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell
                  key={`${column.name}${column.label}`}
                // style={{
                //   backgroundColor: getBackgourndColor(
                //     column.name,
                //     _.get(row.user, column.name)
                //   ),
                // }}
                >
                  <>{_.get(row.user, column.name)}</>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <img src="equity.png" alt="equity" />
    </Box>
  );
};

export default Justice;
