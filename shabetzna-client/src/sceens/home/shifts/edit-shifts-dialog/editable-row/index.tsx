import DeleteIcon from "@mui/icons-material/Delete";
import { Checkbox, FormControlLabel, IconButton, TextField } from "@mui/material";
import { memo } from "react";
import { Control, Controller } from "react-hook-form";
import { FormInput } from "..";
import AutocompleteRTL from "../../../../../components/autocomplete";
import { DAYS } from "../../../../../shared/enums/days";
import { SHIFT_TYPE, ShiftType } from "../../../../../shared/enums/shift-type";
import { User } from "../../../../../shared/types/entities/user";
import style from '../style.module.css';

interface Props {
  control: Control<FormInput, any>;
  index: number;
  dates: Date[];
  teamMembers: User[] | undefined
  onDelete: (index: number) => void;
}
const EditableRow = memo(({ control, index, dates, teamMembers, onDelete }: Props) => {
  const handleDelete = () => onDelete(index);

  return (
    <div className={style.shiftRow}>
      <Controller
        name={`shifts.${index}.isReadiness`}
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} />}
            label="פ+"
          />
        )}
      />

      <Controller
        name={`shifts.${index}.date`}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <AutocompleteRTL
            disableClearable
            options={dates}
            getOptionLabel={(option) =>
              Object.values(DAYS)[(new Date(option).getDay()) ?? 0].label
            }
            defaultValue={field.value}
            value={field.value}
            isOptionEqualToValue={(option, value) => new Date(option).toDateString() === new Date(value).toDateString()}
            onChange={(_, value) => field.onChange(value)}
            renderInput={(params) => <TextField {...params} placeholder="מתי?" />}
          />
        )}
      />
      <Controller
        name={`shifts.${index}.shiftType`}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <AutocompleteRTL
            disableClearable
            options={Object.keys(SHIFT_TYPE) as ShiftType[]}
            getOptionLabel={(option: ShiftType) => SHIFT_TYPE[option].label}
            defaultValue={field.value as ShiftType}
            onChange={(_, value) => field.onChange(value)}
            renderInput={(params) => <TextField {...params} placeholder="סוג משמרת" />}
          />
        )}
      />

      <Controller
        name={`shifts.${index}.assignedUser`}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <AutocompleteRTL
            disableClearable
            options={teamMembers ?? []}
            getOptionLabel={(option) => option?.username}
            defaultValue={field.value}
            value={field.value}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) => field.onChange(value)}
            renderInput={(params) => <TextField {...params} placeholder="מי?" />}
          />
        )}
      />

      <Controller
        name={`shifts.${index}.comment`}
        control={control}
        render={({ field }) => (
          <TextField {...field} placeholder="הערות" />
        )}
      />

      <IconButton onClick={handleDelete} title="מחיקת משמרת">
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
  , (prevProps, nextProps) => prevProps.index === nextProps.index
);

export default EditableRow;
