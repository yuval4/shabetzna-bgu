import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import classNames from "classnames";
import { useContext, useMemo, useRef } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import Disable from "../../../../components/disable";
import { TeamContext } from "../../../../context/team-context";
import { TimeRangeViewContext } from "../../../../context/time-range-view-context";
import { useTrack } from "../../../../hooks/use-track";
import { useUpdateShifts } from "../../../../mutations/shifts";
import { getUsersOfTeam } from "../../../../queries/teams";
import {
  getDatesBetween,
  getUTCTime,
} from "../../../../shared/dates/time-utils";
import { hasTrueValue } from "../../../../shared/has-true-value";
import { Shift } from "../../../../shared/types/entities/shift";
import EditableRow from "./editable-row";
import style from "./style.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
  shifts: Partial<Shift>[];
  missionId?: string;
}

type CreateShift = Partial<
  Pick<Shift, "id" | "comment" | "assignedUser" | "shiftType" | "date">
> &
  Required<Pick<Shift, "isReadiness" | "missionId">>;

export interface FormInput {
  shifts: CreateShift[];
}

const EditShiftsDialog = ({ open, onClose, shifts, missionId }: Props) => {
  const { trackEvent } = useTrack();
  const { selectedTeam } = useContext(TeamContext);
  const { timeRange } = useContext(TimeRangeViewContext);
  const { data: usersToTeam } = getUsersOfTeam(selectedTeam.id);
  const { mutateAsync: saveChanges, isPending } = useUpdateShifts();
  const {
    control,
    handleSubmit,
    watch,
    formState: { dirtyFields },
  } = useForm<FormInput>({
    defaultValues: {
      shifts: (shifts ?? []).map((shift) => {
        return {
          id: shift.id,
          isReadiness: shift.isReadiness ?? false,
          assignedUser: shift.assignedUser,
          shiftType: shift.shiftType ?? "FULL_DAY",
          date: shift.date,
          comment: shift.comment ?? "",
          missionId: shift.missionId ?? missionId,
        };
      }),
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "shifts",
    keyName: "_id",
  });
  const watchedShifts = watch("shifts");
  const shiftsIdsToDelete = useRef<Set<Shift["id"]>>(new Set());
  const isChanged =
    watchedShifts?.filter((_, index) => dirtyFields.shifts?.[index]).length >
      0 || shiftsIdsToDelete.current.size > 0;
  const dates = useMemo(
    () => getDatesBetween(timeRange.start, timeRange.end),
    [timeRange.start, timeRange.end],
  );
  const teamMembers = useMemo(
    () => usersToTeam?.map((userToTeam) => userToTeam.user),
    [usersToTeam],
  );

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    trackEvent("shifts", "save_changes", {
      existingShiftsAmount: shifts?.length,
    });

    const modifiedShifts = data.shifts
      .filter(
        (_, index) =>
          hasTrueValue(dirtyFields.shifts?.[index]) || !fields[index].id,
      )
      .map((a) => ({ ...a, date: getUTCTime(a.date) }));

    await saveChanges({
      shifts: modifiedShifts,
      shiftsIdsToDelete: Array.from(shiftsIdsToDelete.current),
    });

    onClose();
  };

  const handleAddShift = () => {
    trackEvent("shifts", "add_shift_in_edit_modal", {
      existingShiftsAmount: shifts?.length,
    });
    append({
      isReadiness: false,
      missionId,
    });
  };

  const handleDeleteShift = (index: number) => {
    trackEvent("shifts", "delete", { shiftsAmount: fields.length, index });

    if (fields[index].id) {
      shiftsIdsToDelete.current.add(fields[index].id);
    }

    remove(index);
  };

  const handleExitModal = () => {
    trackEvent("shifts", "close_modal_with_unsaved_changes", {
      existingShiftsAmount: shifts?.length,
    });
    if (
      !isChanged ||
      window.confirm("האם אתה בטוח שברצונך לצאת? השינויים לא ישמרו")
    ) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleExitModal}
      className={classNames(style.dialog, { [style.loading]: isPending })}
      PaperProps={{ className: style.paper }}
    >
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>עריכת משמרות</span>

        <Button variant="outlined" onClick={handleAddShift}>
          + הוספת משמרת
        </Button>
      </DialogTitle>
      <DialogContent>
        {fields.map((field, index) => (
          <EditableRow
            key={field._id}
            control={control}
            index={index}
            dates={dates}
            teamMembers={teamMembers}
            onDelete={handleDeleteShift}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Disable disabled={!isChanged} resource="לא נעשו שינויים">
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            שמירה
          </Button>
        </Disable>
        <Button onClick={onClose}>ביטול</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditShiftsDialog;
