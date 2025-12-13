import { Box, Button, TextField, Typography } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import AutocompleteRTL from "../../../components/autocomplete";
import { getAllUnits } from "../../../queries/units";
import { Unit } from "../../../shared/types/entities/unit";
import { useCreateTeam } from "../../../mutations/teams";

export interface FormInput {
  name: string;
  unit: Unit;
}

// TODO refetch teams after creating a team

const CreateTeamForm = () => {
  const { data: units } = getAllUnits();
  const { mutateAsync: save, isPending } = useCreateTeam();
  const { control, handleSubmit, reset, } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    await save(data);
    reset({
      name: "",
      unit: undefined
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1">יצירת צוות</Typography>

      <Box>
        <Controller
          name={"name"}
          control={control}
          render={({ field }) => (
            <TextField {...field} placeholder="שם הצוות" />
          )}
        />
        <Controller
          name={"unit"}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <AutocompleteRTL
              disableClearable
              disabled={units === undefined}
              options={units ?? []}
              getOptionLabel={(option) => option?.name}
              defaultValue={field.value}
              value={field.value}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, value) => field.onChange(value)}
              renderInput={(params) => (
                <TextField {...params} placeholder="יחידה" />
              )}
            />
          )}
        />
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={isPending}>
          יצירה
        </Button>
      </Box>
    </Box>
  );
};

export default CreateTeamForm;
