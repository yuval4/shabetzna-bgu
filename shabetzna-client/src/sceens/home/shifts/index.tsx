import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import {
  Box,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { utils, writeFileXLSX } from "xlsx";
import Disable from "../../../components/disable";
import ShiftsCalendar from "../../../components/shifts-calendar";
import ShiftsTable from "../../../components/shifts-table";
import { TeamContext } from "../../../context/team-context";
import { TimeRangeViewContext } from "../../../context/time-range-view-context";
import { UserContext } from "../../../context/user-context";
import { useRoles } from "../../../hooks/use-roles";
import { useTrack } from "../../../hooks/use-track";
import { getConstraintByMissionAndRange } from "../../../queries/constraint";
import { getMissionByTeamId } from "../../../queries/missions";
import { getMissionShifts } from "../../../queries/shifts";
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
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const { user } = useContext(UserContext);
  const { hasRole } = useRoles();
  const [open, setOpen] = useState(false);
  const { timeRange, handleNextWeek, handlePrevWeek } =
    useContext(TimeRangeViewContext);
  const { selectedTeam } = useContext(TeamContext);
  const { data: mission } = getMissionByTeamId(selectedTeam.id);
  const missionId = mission?.id;

  // Calculate date range based on view mode
  const getDateRange = () => {
    if (viewMode === "month") {
      const year = currentMonthDate.getFullYear();
      const month = currentMonthDate.getMonth();
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      return { start: monthStart, end: monthEnd };
    }
    return { start: timeRange.start, end: timeRange.end };
  };

  const dateRange = getDateRange();
  const { data: shifts, isLoading: shiftsLoading } = getMissionShifts(
    missionId ?? "",
    dateRange.start,
    dateRange.end,
  );
  const { data: constraints } = getConstraintByMissionAndRange(
    missionId ?? "",
    dateRange.start,
    dateRange.end,
  );
  const canManageShifts = !!missionId;

  const handleOpenDialog = () => {
    const isPendingConstraints = (constraints ?? []).some(
      (constraint) => constraint.status === "PENDING" || !constraint.status,
    );

    trackEvent("shifts", "open_create_modal", { isPendingConstraints });

    if (
      !isPendingConstraints ||
      window.confirm(
        "רגע לפני, נראה שיש אילוצים שעדיין לא אושרו. \n להמשיך בכל זאת?",
      )
    ) {
      setOpen(true);
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
      `shifts${formatDate(dateRange.start)}-${formatDate(dateRange.end)}.xlsx`,
    );
  };

  const handleEditShiftsModalOpen = () => {
    trackEvent("shifts", "open_edit_modal", {
      existingShiftsAmount: shifts?.length,
    });
    setEditShiftsModalOpen(true);
  };

  const handleEditShiftsModalClose = () => setEditShiftsModalOpen(false);

  // Update the month display when the selected week changes in month view
  // Update month display when the selected week changes in month view
  useEffect(() => {
    if (viewMode === "month") {
      setCurrentMonthDate(new Date(timeRange.start));
    }
  }, [timeRange, viewMode]);

  const handleViewModeChange = (
    event: any,
    newMode: "week" | "month" | null,
  ) => {
    if (newMode !== null) {
      trackEvent("shifts", "toggle_view", { view: newMode });
      setViewMode(newMode);
      if (newMode === "month") {
        // When switching to month view, set the display month to the current week's month
        setCurrentMonthDate(new Date(timeRange.start));
      }
    }
  };

  return (
    <Box className={style.container}>
      {isEditShiftsModalOpen && (
        <EditShiftsDialog
          open={isEditShiftsModalOpen}
          onClose={handleEditShiftsModalClose}
          shifts={shifts || []}
          missionId={missionId}
        />
      )}

      <Box className={style.actions}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
          dir="ltr"
        >
          <ToggleButton value="week" aria-label="שבוע">
            <ViewWeekIcon />
          </ToggleButton>
          <ToggleButton value="month" aria-label="חודש">
            <CalendarMonthIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        {hasRole(["SHIFTS_ADMIN", "TEAM_LEADER"]) && (
          <IconButton
            disabled={!canManageShifts}
            onClick={handleEditShiftsModalOpen}
            className={style.actionIcon}
            title="עריכת משמרות"
          >
            <AppRegistrationIcon />
          </IconButton>
        )}

        <Disable
          disabled={shifts?.length === 0}
          reason="לא קיימות משמרות לייצוא"
        >
          <IconButton
            onClick={handleExportToExcel}
            className={style.actionIcon}
            title="ייצוא לאקסל"
          >
            <FileDownloadIcon />
          </IconButton>
        </Disable>
      </Box>

      {viewMode === "month" ? (
        <ShiftsCalendar
          shifts={shifts || []}
          loading={shiftsLoading}
          selectedWeekStart={timeRange.start}
          selectedWeekEnd={timeRange.end}
          currentMonthDate={currentMonthDate}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
        />
      ) : (
        <ShiftsTable
          loading={shiftsLoading}
          title={`שבצק שבוע ${formatDate(timeRange.start)} - ${formatDate(
            timeRange.end,
          )}`}
          columns={columns}
          minimizedColumns={minimizedColumns}
          rows={shifts || []}
          onNext={handleNextWeek}
          onPrev={handlePrevWeek}
          highlightedRow={(shift) => shift?.assignedUser?.id === user?.id}
          isHistory={(shift) => isHistory(shift.date)}
          noData={
            hasRole(["SHIFTS_ADMIN", "TEAM_LEADER"]) ? (
              <Button
                variant="glow"
                onClick={handleOpenDialog}
                endIcon={<AutoFixHighIcon />}
              >
                שַׁבֵּץנָא
              </Button>
            ) : undefined
          }
        />
      )}

      <GenerateShiftsSettingsDialog
        open={open}
        onClose={handleCloseDialog}
        missionId={missionId}
      />
    </Box>
  );
};

export default Shifts;
