import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Box, Button, IconButton } from "@mui/material";
import { useContext, useState } from "react";
import { utils, writeFileXLSX } from "xlsx";
import Disable from "../../../components/disable";
import ShiftsTable from "../../../components/shifts-table";
import { TeamContext } from "../../../context/team-context";
import { TimeRangeViewContext } from "../../../context/time-range-view-context";
import { UserContext } from "../../../context/user-context";
import { useRoles } from "../../../hooks/use-roles";
import { useTrack } from "../../../hooks/use-track";
import { getConstraintByTeamAndRange } from "../../../queries/constraint";
import { getTeamShifts } from "../../../queries/shifts";
import { formatDate, weekDay } from "../../../shared/dates/format-date";
import { isHistory } from "../../../shared/dates/time-utils";
import { formatPhone } from "../../../shared/format/phone";
import EditShiftsDialog from "./edit-shifts-dialog";
import GenerateShiftsSettingsDialog from "./generate-shifts-button/generate-shifts-settings-dialog";
import { columns, minimizedColumns } from "./model";
import style from "./style.module.css";

const Shifts = () => {
  const { trackEvent } = useTrack();
  const [isEditShiftsModalOpen, setEditShiftsModalOpen] = useState(false);
  const { user } = useContext(UserContext);
  const { hasRole } = useRoles();
  const [open, setOpen] = useState(false);
  const { timeRange, handleNextWeek, handlePrevWeek } =
    useContext(TimeRangeViewContext);
  const { selectedTeam } = useContext(TeamContext);
  const { data: shifts, isLoading: shiftsLoading } = getTeamShifts(
    selectedTeam.id,
    timeRange.start,
    timeRange.end
  );
  const { data: constraints } =
    getConstraintByTeamAndRange(
      selectedTeam.id,
      timeRange.start,
      timeRange.end
    );


  const handleOpenDialog = () => {
    const isPendingConstraints = (constraints ?? []).some((constraint) => constraint.status === "PENDING" || !constraint.status);

    trackEvent("shifts", "open_create_modal", { isPendingConstraints });

    if (!isPendingConstraints || window.confirm("רגע לפני, נראה שיש אילוצים שעדיין לא אושרו. \n להמשיך בכל זאת?")) {
      setOpen(true)
    }
  };

  const handleCloseDialog = () => setOpen(false);

  const handleExportToExcel = () => {
    trackEvent("shifts", "export", { team: selectedTeam.name });

    if (!shifts) return;

    const worksheet = utils.aoa_to_sheet([
      ["תאריך", "יום", "סוג משמרת", "כונן", "טלפון", "הערות"],
      ...shifts.map((shift) => [
        `${formatDate(shift.date)}`,
        weekDay(shift.date),
        shift.shiftType,
        shift.assignedUser?.username,
        formatPhone(shift.assignedUser?.phone),
      ]),
    ]);
    const workbook = utils.book_new();
    if (workbook.Workbook) {
      if (workbook.Workbook.Views) {
        workbook.Workbook.Views = [{ RTL: true }];
      }
    }
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    writeFileXLSX(
      workbook,
      `shifts${formatDate(timeRange.start)}-${formatDate(timeRange.end)}.xlsx`
    );
  };

  const handleEditShiftsModalOpen = () => {
    trackEvent("shifts", "open_edit_modal", { existingShiftsAmount: shifts?.length });
    setEditShiftsModalOpen(true)
  };

  const handleEditShiftsModalClose = () => setEditShiftsModalOpen(false);

  return (
    <Box className={style.container}>
      {isEditShiftsModalOpen &&
        <EditShiftsDialog
          open={isEditShiftsModalOpen}
          onClose={handleEditShiftsModalClose}
          shifts={shifts || []}
        />
      }

      <Box className={style.actions}>
        {hasRole(["SHIFTS_ADMIN", "TEAM_LEADER"]) &&
          <IconButton
            onClick={handleEditShiftsModalOpen}
            className={style.actionIcon}
            title="עריכת משמרות"
          >
            <AppRegistrationIcon />
          </IconButton>
        }

        <Disable disabled={shifts?.length === 0} reason="לא קיימות משמרות לייצוא">
          <IconButton
            onClick={handleExportToExcel}
            className={style.actionIcon}
            title="ייצוא לאקסל"
          >
            <FileDownloadIcon />
          </IconButton>
        </Disable>
      </Box>

      <ShiftsTable
        loading={shiftsLoading}
        title={`שבצק שבוע ${formatDate(timeRange.start)} - ${formatDate(
          timeRange.end
        )}`}
        columns={columns}
        minimizedColumns={minimizedColumns}
        rows={shifts || []}
        onNext={handleNextWeek}
        onPrev={handlePrevWeek}
        highlightedRow={(shift) => shift?.assignedUser?.id === user?.id}
        isHistory={(shift) => isHistory(shift.date)}
        noData={hasRole(["SHIFTS_ADMIN", "TEAM_LEADER"])
          ?
          <Button
            variant="glow"
            onClick={handleOpenDialog}
            endIcon={<AutoFixHighIcon />}
          >
            שַׁבֵּץנָא
          </Button> : undefined}
      />

      <GenerateShiftsSettingsDialog open={open} onClose={handleCloseDialog} />
    </Box >
  );
};

export default Shifts;
