import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import { useContext } from "react";
import { TeamContext } from "../../../context/team-context";
import { UserContext } from "../../../context/user-context";
import { useRemoveUserFromTeam } from "../../../mutations/teams";
import { ROLES } from "../../../shared/enums/roles";
import { formatPhone } from "../../../shared/format/phone";
import { UserToTeam } from "../../../shared/types/entities/user-to-team";
import style from "./style.module.css";
import { useRoles } from "../../../hooks/use-roles";
import { useTrack } from "../../../hooks/use-track";

interface Props {
  userToTeam: UserToTeam;
}

const UserCard = ({ userToTeam: user }: Props) => {
  const { trackEvent } = useTrack()
  const { selectedTeam } = useContext(TeamContext);
  const { user: loggedInUser } = useContext(UserContext);
  const { hasRole } = useRoles();
  const { mutate: removeUser, isPending: isLoadingRemove } = useRemoveUserFromTeam();

  const handleRemoveUserFromTeam = () => {
    trackEvent("teams", "remove_user");
    if (window.confirm("בטוח שאתה רוצה למחוק את המשתמש?")) {
      removeUser({ id: selectedTeam.id, userId: user.user.id });
    }
  };

  return (
    <div className={style.userCard}>
      <div className={style.userInfo}>
        <AccountCircleIcon className={style.image} />
        <div className={style.name}>
          <Typography>
            {user.user.username}
            {user.user.id === loggedInUser?.id && (
              <Typography component="span" className={style.meTag}>
                אני
              </Typography>
            )}
          </Typography>

          <Typography>
            <strong>תפקיד:</strong> {ROLES[user.role].label}
          </Typography>
        </div>
      </div>
      <div>{formatPhone(user.user.phone)}</div>
      <div>{user.isActiveShifts ? "נכלל במשמרות" : "לא נכלל במשמרות"}</div>
      {
        hasRole(["SHIFTS_ADMIN", "TEAM_LEADER"]) &&
        <div>
          {isLoadingRemove ?
            <CircularProgress size={24} />
            :
            user.user.id !== loggedInUser?.id && (
              <IconButton
                title="הסרת המשתמש מהצוות"
                onClick={handleRemoveUserFromTeam}
              >
                <PersonRemoveIcon />
              </IconButton>
            )}
        </div>
      }
    </div>
  );
};

export default UserCard;
