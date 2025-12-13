import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Box, IconButton, Typography } from "@mui/material";
import { useContext, useState } from "react";
import Disable from "../../../components/disable";
import { TeamContext } from "../../../context/team-context";
import { TimeRangeViewContext } from "../../../context/time-range-view-context";
import { UserContext } from "../../../context/user-context";
import { getConstraintByTeamAndRange } from "../../../queries/constraint";
import ConstraintsList from "./constraints-list";
import CreateConstraintDialog from "./create-constraint-dialog";
import style from "./style.module.css";
import { useTrack } from "../../../hooks/use-track";

const Constraints = () => {
  const { trackEvent } = useTrack();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(UserContext);
  const { selectedTeam } = useContext(TeamContext);
  const { timeRange } = useContext(TimeRangeViewContext);
  const { data: constraints, isLoading: constraintsLoading } =
    getConstraintByTeamAndRange(
      selectedTeam.id,
      timeRange.start,
      timeRange.end
    );

  // useMemo?
  const userConstraints = constraints?.filter(
    (constraint) => constraint.user.id === user?.id
  );

  const otherConstraints = constraints?.filter(
    (constraint) => constraint.user.id !== user?.id
  );

  const handleOpenModal = () => {
    trackEvent("constraints", "open_create_modal");
    setIsModalOpen(true)
  };

  const handleCloseModal = () => {
    trackEvent("constraints", "close_create_modal");
    setIsModalOpen(false)
  };

  const handleFilterClick = () => {
    trackEvent("constraints", "filter");
  }

  return (
    <Box className={style.container}>
      {isModalOpen && <CreateConstraintDialog open={isModalOpen} onClose={handleCloseModal} />}
      <Box className={style.title}>
        <Typography variant="subtitle1">האילוצים שלי</Typography>
        <Box className={style.icons}>
          <IconButton title="סינון" onClick={handleFilterClick}>
            <Disable reason="סינון - בקרוב">
              <FilterAltIcon />
            </Disable>
          </IconButton>

          <IconButton onClick={handleOpenModal} title="הוספה">
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      <ConstraintsList
        loading={constraintsLoading}
        constraints={userConstraints!}
        emptyMessage="נראה שאין לך אילוצים השבוע, אפשר להזין אותם בכפתור ה+"
      />

      <Box className={style.title}>
        <Typography variant="subtitle1">הצוות שלי</Typography>
      </Box>
      <ConstraintsList constraints={otherConstraints!} loading={constraintsLoading} />
    </Box>
  );
};

export default Constraints;
