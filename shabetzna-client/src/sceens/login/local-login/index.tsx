import { Button, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/user-context";
import { useLogin } from "../../../mutations/auth";
import { getAllTeams, getUsersOfTeam } from "../../../queries/teams";
import { setLocalStorage, USER_TOKEN_KEY } from "../../../shared/local-storage";
import { useTrack } from "../../../hooks/use-track";

const LocalLoginScreen = () => {
  const { trackEvent } = useTrack();
  const navigate = useNavigate();
  const { user, checkUser } = useContext(UserContext);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const { data: teams, isLoading: isTeamsLoading } = getAllTeams();
  const { data: usersByTeam, isLoading: isUsersByTeamLoading } = getUsersOfTeam(selectedTeamId);
  const { mutateAsync: onLogin, isPending: isLoginPending } = useLogin();

  const handleSetTeam = (event: SelectChangeEvent) => {
    setSelectedTeamId(event.target.value as string);
    setSelectedUserId("");
  };

  const handleSetUser = (event: SelectChangeEvent) => setSelectedUserId(event.target.value as string);

  const handleLogin = async () => {
    trackEvent("auth", "local");
    try {
      const token = await onLogin({ id: selectedUserId });
      setLocalStorage(USER_TOKEN_KEY, token);
      await checkUser();
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      setLocalStorage(USER_TOKEN_KEY, token);
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (user) {
      return navigate("/");
    }
  }, [user]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: 150,
      }}
    >
      <img
        src="full-logo.png"
        alt="לוגו"
        style={{
          width: "40vw",
          minWidth: 200,
          maxWidth: 400,
        }}
      />

      <div>
        <Select
          value={selectedTeamId}
          onChange={handleSetTeam}
          placeholder="צוות"
          style={{
            width: "300px",
            margin: "60px 60px 10px",
          }}
          disabled={isTeamsLoading}
        >
          {teams &&
            teams.map((team) => (
              <MenuItem value={team.id} key={team.id}>
                {team.name}
              </MenuItem>
            ))}
        </Select>

        <Select
          value={selectedUserId}
          onChange={handleSetUser}
          placeholder="בחר משתמש"
          style={{
            width: "300px",
            margin: "10px 60px 60px 60px",
          }}
          disabled={isUsersByTeamLoading || !selectedTeamId}
        >
          {usersByTeam &&
            usersByTeam.map((user) => (
              <MenuItem value={user.user.id} key={user.id}>
                {user.user.username}
              </MenuItem>
            ))}
        </Select>
      </div>

      <Button
        variant="contained"
        color="secondary"
        disabled={!selectedUserId || !selectedTeamId || isLoginPending}
        onClick={handleLogin}
      >
        {isLoginPending ? "מתחבר..." : "התחבר"}
      </Button>
    </div>
  );
};

export default LocalLoginScreen;
