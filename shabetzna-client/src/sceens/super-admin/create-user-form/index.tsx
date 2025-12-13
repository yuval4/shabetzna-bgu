import { Box, Button, TextField, Typography } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useCreateUser } from "../../../mutations/users";
import { User } from "../../../shared/types/entities/user";

export interface FormInput extends Pick<User, "username" | "email" | "phone"> { }

const CreateUserForm = () => {
  const { mutateAsync: save, isPending } = useCreateUser();
  const { control, handleSubmit, reset, } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    await save(data);
    reset({
      username: "",
      email: "",
      phone: "",
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1">משתמש צוות</Typography>

      <Box>
        <Controller
          name={"username"}
          control={control}
          render={({ field }) => (
            <TextField {...field} placeholder="שם" />
          )}
        />
        <Controller
          name={"email"}
          control={control}
          render={({ field }) => (
            <TextField {...field} placeholder="מייל" type="email" />
          )}
        />
        <Controller
          name={"phone"}
          control={control}
          render={({ field }) => (
            <TextField {...field} placeholder="טלפון" type="text" />
          )}
        />
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={isPending}>
          יצירה
        </Button>
      </Box>
    </Box>
  );
};

export default CreateUserForm;
