import { useContext, useState } from "react";
import ShiftsTable from "../../components/shifts-table";
import { UserContext } from "../../context/user-context";
import { getSpartaView } from "../../queries/shifts";
import { formatDate, weekDay } from "../../shared/dates/format-date";
import { addDays, isHistory } from "../../shared/dates/time-utils";
import { columns, minimizedColumns } from "./models";
import style from "./style.module.css";
import { TeamContext } from "../../context/team-context";
import { Typography } from "@mui/material";

const Sparta = () => {
  const [date, setDate] = useState(new Date());
  const { user } = useContext(UserContext);
  const { selectedTeam } = useContext(TeamContext);
  const { data: shifts, isLoading } = getSpartaView(selectedTeam.unitId, date, date);

  const handleNextDay = () => setDate(addDays(date, 1));
  const handlePrevDay = () => setDate(addDays(date, -1));

  if (!selectedTeam.unitId) {
    return (<div className={style.container}>
      <Typography variant="subtitle1">הצוות לא משוייך ליחידה</Typography>
    </div>)
  }

  return (
    <div className={style.container}>
      <ShiftsTable
        loading={isLoading}
        title={`שבצק יום ${weekDay(date)}  ${formatDate(date)}`}
        columns={columns}
        minimizedColumns={minimizedColumns}
        rows={shifts || []}
        onNext={handleNextDay}
        onPrev={handlePrevDay}
        highlightedRow={(shift) => shift?.assignedUser?.id === user?.id}
        isHistory={(shift) => isHistory(shift.date)}
      />
    </div>
  );
};

export default Sparta;
