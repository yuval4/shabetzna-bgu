import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, Button, Drawer, Grid, IconButton, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import AudioPlayer from "../components/audio-player";
import { TeamContext } from "../context/team-context";
import { UserContext } from "../context/user-context";
import { pages } from "../shared/routes/routes";
import { Team } from "../shared/types/entities/team";
import style from "./style.module.css";
import { useLogout } from "../mutations/auth";
import MenuIcon from '@mui/icons-material/Menu';
import { useTrack } from "../hooks/use-track";

const Layout = () => {
  const { trackEvent, trackUnit, trackTeam, registerProperty } = useTrack();
  const { user, logout } = useContext(UserContext);
  const { selectedTeam, setSelectedTeam, role } = useContext(TeamContext);
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('md'));
  const { mutate: onLogout } = useLogout({
    onSuccess: () => {
      logout();
      navigate("/login");
    },
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: Team["id"]) => {
    const selectedTeam = user?.teams.find((team) => team?.team?.id === newValue)?.team;

    trackEvent("layout", "team_switch", { teamId: selectedTeam?.id, teamName: selectedTeam?.name });

    if (selectedTeam) {
      trackTeam(selectedTeam);
      trackUnit({ id: selectedTeam?.unitId });
      registerProperty({ teamId: selectedTeam?.id, teamName: selectedTeam?.name, unitId: selectedTeam?.unitId, role });
    }

    setSelectedTeam(selectedTeam!);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    trackEvent("layout", "open_menu", { open: newOpen });
    setIsDrawerOpen(newOpen);
  };

  const handleLogout = async () => {
    trackEvent("auth", "logout");
    await onLogout();
  };

  const handleAvatarClick = () => {
    trackEvent("users", "avatar_clicked")
  }

  return (
    <Grid container className={style.container}>
      <Grid item xs={12} className={style.header}>
        <Box className={style.headerRight}>
          <img src="full-logo.png" alt="logo" title="שבץנא" width={83} />
          {user?.teams && user?.teams.length > 0 && selectedTeam.id && (
            <Tabs
              value={selectedTeam.id}
              onChange={handleChange}
              className={style.tabs}
            >
              {user?.teams?.map((team) => (
                <Tab
                  key={team.team.id}
                  label={team.team.name}
                  value={team.team.id}
                />
              ))}
            </Tabs>
          )}
        </Box>
        <Box className={style.headerLeft}>
          {!isPhone && <Button onClick={handleLogout}>התנתקות</Button>}
          {isPhone ?
            <IconButton onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton> :
            <AudioPlayer src="nofiki-song.mp3" />}
          <img src="https://thispersondoesnotexist.com/" alt="avatar" title={user?.username} className={style.userIcon} onClick={handleAvatarClick} />
        </Box>
      </Grid>
      {!isPhone && (
        <Grid item className={style.sidebar}>
          {pages.map((page) => (
            <NavLink
              to={page.path}
              key={page.name}
              className={({ isActive }) =>
                classNames(style.link, { [style.activeLink]: isActive })
              }
            >
              {page.icon}
              {page.label}
            </NavLink>
          ))}
        </Grid>
      )}
      <Grid item xs className={style.main}>
        <Outlet />
      </Grid>
      <Drawer open={isDrawerOpen} onClose={toggleDrawer(false)}
        anchor="bottom">
        <Grid item className={style.drawer}>
          {pages.map((page) => (
            <NavLink
              to={page.path}
              key={page.name}
              className={({ isActive }) =>
                classNames(style.link, { [style.activeLink]: isActive })
              }
              onClick={toggleDrawer(false)}
            >
              {page.icon}
              {page.label}
            </NavLink>
          ))}
          <Button onClick={handleLogout}>התנתקות</Button>
        </Grid>
      </Drawer>
    </Grid>
  );
};

export default Layout;
