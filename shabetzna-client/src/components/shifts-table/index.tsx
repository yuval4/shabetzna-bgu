import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { useMemo, useState } from "react";
import { Column } from "./models";
import style from "./style.module.css";
import { SORT_DIRECTION } from "../../shared/enums/sort-direction";
import theme from "../../shared/theme";
import TableSkeleton from "./tabele-skeleton";

interface Props<T extends Object> {
  title: string;
  onNext: () => void;
  onPrev: () => void;
  columns: Column<T>[];
  minimizedColumns?: Column<T>[];
  rows: T[];
  highlightedRow?: (row: T) => boolean;
  isHistory?: (row: T) => boolean;
  loading?: boolean;
  noData?: React.ReactNode;
}

const ShiftsTable = <T extends { id: string }>({
  title,
  columns,
  minimizedColumns,
  rows,
  onNext,
  onPrev,
  highlightedRow = () => false,
  isHistory = () => false,
  loading = false,
  noData = <Typography variant="subtitle1">אין נתונים</Typography>,
}: Props<T>) => {
  const [sortColumn, setSortColumn] = useState<Column<T> | null>(null);
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(
    SORT_DIRECTION.ASC
  );
  const isPhone = useMediaQuery(theme.breakpoints.down('md'));
  const displayColumns = (isPhone && minimizedColumns) ? minimizedColumns : columns;

  const sortedRows = useMemo(() => {
    if (!sortColumn) return rows;

    return _.orderBy(
      rows,
      [(row) => _.get(row, sortColumn.name)],
      [sortDirection]
    );
  }, [rows, sortColumn, sortDirection]);

  const handleSort = (column: Column<T>) => () => {
    if (sortColumn?.name === column.name) {
      setSortDirection((prevDirection) =>
        prevDirection === SORT_DIRECTION.ASC
          ? SORT_DIRECTION.DESC
          : SORT_DIRECTION.ASC
      );
    } else {
      setSortColumn(column);
      setSortDirection(SORT_DIRECTION.ASC);
    }
  };

  if (loading) {
    return <TableSkeleton />
  }

  return (
    <TableContainer className={style.tableContainer}>
      <Box className={style.title}>
        <Typography variant="subtitle1" className={style.titleText}>{title}</Typography>

        <Box className={style.actionIcons}>
          <IconButton onClick={onPrev}>
            <ArrowCircleRightIcon />
          </IconButton>
          <IconButton onClick={onNext}>
            <ArrowCircleLeftIcon />
          </IconButton>
        </Box>
      </Box>

      {
        !rows.length ?
          <Box className={style.onDataContainer}>
            {noData}
          </Box>
          :
          <Table stickyHeader className={style.table}>
            <TableHead>
              <TableRow>
                {displayColumns.map((column) => (
                  <TableCell
                    key={`${column.name}${column.label}`}
                    onClick={column.sortby && handleSort(column)}
                    className={style.column}
                    width={column.width}
                  >
                    {column.label}
                    {column.sortby && (
                      <span
                        className={classNames(style.arrow, {
                          [style.hideArrow]: sortColumn?.name !== column.name,
                        })}
                      >
                        {sortDirection === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.map((row) => (
                <TableRow
                  key={row.id}
                  className={classNames(
                    style.row,
                    {
                      [style.highlightedRow]: highlightedRow(row),
                      [style.historyRow]: isHistory(row),
                    }
                  )}
                >
                  {displayColumns.map((column) => (
                    <TableCell key={`${column.name}${column.label}`}>
                      <>
                        {column.format
                          ? column.format(_.get(row, column.name), row)
                          : _.get(row, column.name)}
                      </>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
      }
    </TableContainer>
  );
};

export default ShiftsTable;
