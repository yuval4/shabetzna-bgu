import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import classNames from "classnames";
import { useContext, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { TeamContext } from "../../../../../context/team-context";
import { TimeRangeViewContext } from "../../../../../context/time-range-view-context";
import { useAllocateShifts } from "../../../../../mutations/shifts";
import { getUsersOfTeam } from "../../../../../queries/teams";
import { getUTCTime } from "../../../../../shared/dates/time-utils";
import {
  ALLOCATE_SHIFT_TYPE,
  AllocateShiftType,
} from "../../../../../shared/enums/shift-type";
import { UserToTeam } from "../../../../../shared/types/entities/user-to-team";
import style from "./style.module.css";

interface FormValues {
  members: UserToTeam[];
  shiftsType: AllocateShiftType;
  usersPerShift: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  missionId?: string;
}

const GenerateShiftsSettingsDialog = ({ open, onClose, missionId }: Props) => {
  const { selectedTeam } = useContext(TeamContext);
  const { timeRange } = useContext(TimeRangeViewContext);
  const { data: teamMembers } = getUsersOfTeam(selectedTeam.id);

  const { mutateAsync: allocateShifts, isPending } = useAllocateShifts();
  const { control, handleSubmit, reset, register } = useForm<FormValues>();

  useEffect(() => {
    if (teamMembers) {
      reset({
        members: teamMembers,
        shiftsType: "FULL_DAY",
      });
    }
  }, [teamMembers, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!missionId) {
      return;
    }

    await allocateShifts({
      missionId,
      userIds: data.members
        .filter((member) => member.isActiveShifts)
        .map((member) => member.user.id),
      shiftsType: data.shiftsType,
      start: getUTCTime(timeRange.start),
      end: getUTCTime(timeRange.end),
      usersPerShift: data.usersPerShift,
    });

    onClose();
  };

  return (
    <Dialog open={open} className={classNames({ [style.loading]: isPending })}>
      <DialogTitle>יצירת משמרות 🪄</DialogTitle>
      <DialogContent className={style.dialogContent}>
        <FormControl>
          <FormLabel>בחר משתמשים פעילים</FormLabel>
          <FormGroup>
            {teamMembers?.map((member, index) => (
              <Controller
                key={member.id}
                name={`members.${index}.isActiveShifts`}
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label={member.user.username}
                  />
                )}
              />
            ))}
          </FormGroup>
        </FormControl>

        <FormControl>
          <FormLabel>בחר אפשרות</FormLabel>
          <Controller
            name="shiftsType"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <RadioGroup {...field}>
                {Object.entries(ALLOCATE_SHIFT_TYPE).map(([key, value]) => (
                  <FormControlLabel
                    key={key}
                    value={key}
                    control={<Radio />}
                    label={value.label}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </FormControl>

        <FormControl>
          <FormLabel>כמה אנשים לשבץ במשמרת?</FormLabel>
          <Controller
            name={"usersPerShift"}
            control={control}
            defaultValue={1}
            rules={{ required: true, min: 1, max: teamMembers?.length ?? 1 }}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="1"
                type="number"
                className={style.usersPerShift}
                {...register("usersPerShift", {
                  valueAsNumber: true,
                })}
              />
            )}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          disabled={!missionId}
          onClick={handleSubmit(onSubmit)}
        >
          שבץנא
        </Button>
        <Button onClick={onClose}>ביטול</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateShiftsSettingsDialog;
