import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import classNames from "classnames";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import AutocompleteRTL from "../../../../components/autocomplete";
import Disable from "../../../../components/disable";
import { TeamContext } from "../../../../context/team-context";
import { TimeRangeViewContext } from "../../../../context/time-range-view-context";
import { UserContext } from "../../../../context/user-context";
import { useRoles } from "../../../../hooks/use-roles";
import { useCreateConstraint } from "../../../../mutations/constraint";
import { getUsersOfTeam } from "../../../../queries/teams";
import { addDays } from "../../../../shared/dates/time-utils";
import { CONSTRAINT_TYPES, ConstraintType } from "../../../../shared/enums/constraint-types";
import { Days, DAYS } from "../../../../shared/enums/days";
import { SHIFT_TYPE, ShiftType } from "../../../../shared/enums/shift-type";
import { Constraint } from "../../../../shared/types/entities/constraint";
import { User } from "../../../../shared/types/entities/user";
import style from "./style.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
  constraint?: Constraint;
}

interface FormInput {
  userId: User["id"];
  type: ConstraintType;
  day: Days;
  reason: string;
  shiftType: ShiftType;
}

const CreateConstraintDialog = ({ open, onClose, constraint }: Props) => {
  const { user } = useContext(UserContext);
  const { selectedTeam } = useContext(TeamContext);
  const { hasRole } = useRoles();
  const { register, handleSubmit, getValues, setValue } = useForm<FormInput>(
    constraint ? {
      defaultValues: {
        userId: constraint.user.id ?? user?.id,
        day: Object.keys(DAYS)[new Date(constraint.date).getDay()] as Days,
        type: constraint.type,
        reason: constraint.reason,
        shiftType: constraint.shiftType,
      },
    }
      :
      {
        defaultValues: {
          userId: user?.id ?? "6e047ebc-f041-4f38-802e-13cfcbedb243",
        },
      }
  );
  const { timeRange } = useContext(TimeRangeViewContext);
  const { isPending, mutateAsync: createConstraint } = useCreateConstraint();
  const { data: teamUsers, isLoading: isLoadingUsers } = getUsersOfTeam(selectedTeam.id);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const dayIndex =
      Object.values(DAYS).find((value) => value.id === data.day)?.index ?? 0;

    await createConstraint({
      ...(constraint?.id && { id: constraint.id }),
      userId: data.userId,
      date: addDays(timeRange.start, dayIndex),
      type: data.type,
      reason: data.reason,
      shiftType: data.shiftType,
    });

    onClose();
  };

  if (isLoadingUsers) return <Dialog open={open}>טוען...</Dialog>;

  const users = (teamUsers ?? []).map((user) => user.user);

  return (
    <Dialog open={open} className={classNames({ [style.loading]: isPending })}>
      <DialogTitle>יצירת אילוץ</DialogTitle>
      <DialogContent className={style.dialogContent}>
        <Disable disabled={!hasRole(["TEAM_LEADER", "SHIFTS_ADMIN"])}>
          <AutocompleteRTL
            options={users}
            autoHighlight
            defaultValue={users?.find(currentUser => currentUser.id === getValues("userId"))}
            getOptionLabel={(option) => option.username}
            disableClearable
            disabled={isLoadingUsers}
            onChange={(_event: any, newValue: User | null) => {
              newValue && setValue("userId", newValue.id);
            }}
            renderInput={(params) => <TextField {...params} placeholder="מי?" />}
          />

        </Disable>
        <AutocompleteRTL
          options={Object.keys(CONSTRAINT_TYPES)}
          getOptionLabel={(option: string) =>
            CONSTRAINT_TYPES[option as ConstraintType].label
          }
          defaultValue={getValues("type")}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="סוג אילוץ"
              defaultValue={CONSTRAINT_TYPES[getValues("type")]}
              {...register("type", {
                required: true,
                setValueAs: (value) =>
                  Object.keys(CONSTRAINT_TYPES).find(
                    (key) =>
                      CONSTRAINT_TYPES[key as ConstraintType]
                        .label === value
                  ),
              })}
            />
          )}
        />
        <AutocompleteRTL
          options={Object.keys(DAYS) as Days[]}
          getOptionLabel={(option) => DAYS[option].label}
          defaultValue={getValues("day")}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="מתי?"
              defaultValue={DAYS[getValues("day")]}
              {...register("day", {
                required: true,
                setValueAs: (value) =>
                  Object.keys(DAYS).find(
                    (key) =>
                      DAYS[key as Days]
                        .label === value
                  ),
              })}
            />
          )}
        />
        <AutocompleteRTL
          options={Object.keys(SHIFT_TYPE)}
          getOptionLabel={(option: string) =>
            SHIFT_TYPE[option as ShiftType].label
          }
          defaultValue={getValues("shiftType")}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="מתי בדיוק?"
              defaultValue={SHIFT_TYPE[getValues("shiftType")]}
              {...register("shiftType", {
                required: true,
                setValueAs: (value) =>
                  Object.keys(SHIFT_TYPE).find(
                    (key) =>
                      SHIFT_TYPE[key as ShiftType]
                        .label === value
                  ),
              })}
            />
          )}
        />

        <TextField
          placeholder="למה?"
          {...register("reason", { required: true })}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          שמירה
        </Button>
        <Button onClick={onClose}>ביטול</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateConstraintDialog;
