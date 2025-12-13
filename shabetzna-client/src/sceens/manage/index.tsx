import { Button, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { TeamContext } from "../../context/team-context";
import { UserContext } from "../../context/user-context";
import { getUsersOfTeam } from "../../queries/teams";
import AddUserDialog from "./add-user-dialog";
import style from "./style.module.css";
import UsersList from "./users-list";
import { useRoles } from "../../hooks/use-roles";
import { useTrack } from "../../hooks/use-track";

const Manage = () => {
  const { trackEvent } = useTrack();
  const { user: loggedInUser } = useContext(UserContext);
  const { selectedTeam } = useContext(TeamContext);
  const { data: users, isLoading } = getUsersOfTeam(
    selectedTeam.id,
    loggedInUser?.id
  );
  const [isEditShiftsModalOpen, setEditShiftsModalOpen] = useState(false);
  const { hasRole } = useRoles();

  const handleEditOpenModal = () => {
    trackEvent("teams", "add_user");
    setEditShiftsModalOpen(true);
  }

  const handleCloseModal = () => setEditShiftsModalOpen(false);

  return (
    <div className={style.container}>
      {isEditShiftsModalOpen && (
        <AddUserDialog
          open={isEditShiftsModalOpen}
          onClose={handleCloseModal}
          usersToExclude={users?.map((user) => user.user)}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1">ניהול צוות</Typography>
        {hasRole(["SHIFTS_ADMIN", "TEAM_LEADER"]) && <Button onClick={handleEditOpenModal}>+ הוספת משתמש</Button>}
      </div>

      <UsersList
        loading={isLoading}
        users={users}
      />
    </div>
  );
};

export default Manage;
