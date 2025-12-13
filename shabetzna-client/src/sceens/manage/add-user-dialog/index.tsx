import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { useContext } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import AutocompleteRTL from "../../../components/autocomplete";
import { TeamContext } from "../../../context/team-context";
import { useAddUserToTeam } from "../../../mutations/teams";
import { getAllUsers } from "../../../queries/users";
import { Role, ROLES } from "../../../shared/enums/roles";
import { User } from "../../../shared/types/entities/user";
import style from "./style.module.css";

interface Props {
  usersToExclude?: User[];
  open: boolean;
  onClose: () => void;
}

interface FormInput {
  userId: User["id"];
  teamId: string;
  role: Role;
  isActiveShifts: boolean;
}

const AddUserDialog = ({ usersToExclude = [], open, onClose }: Props) => {
  const { data: allUsers, isLoading: isLoadingUsers } = getAllUsers();
  const { selectedTeam } = useContext(TeamContext);
  const { isPending, mutateAsync: addUser } = useAddUserToTeam();
  const { register, handleSubmit, setValue, control } = useForm<FormInput>({
    defaultValues: {
      teamId: selectedTeam.id,
      isActiveShifts: false,
    },
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    await addUser(data);
    onClose();
  };

  const users = (allUsers ?? []).filter(
    (user) => !_.map(usersToExclude, "id").includes(user.id)
  );

  return (
    <Dialog open={open} className={classNames({ [style.loading]: isPending })}>
      <DialogTitle>הוספת משתמש</DialogTitle>
      <DialogContent className={style.dialogContent}>
        <AutocompleteRTL
          options={users!}
          autoHighlight
          getOptionLabel={(option) => option.username}
          disableClearable
          disabled={isLoadingUsers}
          onChange={(_event: any, newValue: User | null) => {
            newValue && setValue("userId", newValue.id);
          }}
          renderInput={(params) => <TextField {...params} placeholder="מי?" />}
        />

        <AutocompleteRTL
          options={Object.keys(ROLES)}
          getOptionLabel={(option) => ROLES[option as Role].label}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="תפקיד"
              {...register("role", {
                required: true,
                setValueAs: (value) =>
                  Object.keys(ROLES).find(
                    (key) => ROLES[key as Role].label === value
                  ),
              })}
            />
          )}
        />

        <FormControlLabel
          control={
            <Controller
              name="isActiveShifts"
              control={control}
              render={({ field }) => <Checkbox {...field} />}
            />
          }
          label="נכלל במשמרות"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={isPending}>
          שמירה
        </Button>
        <Button onClick={onClose} disabled={isPending}>ביטול</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
