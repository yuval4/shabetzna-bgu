import BalanceIcon from "@mui/icons-material/Balance";
import ExploreIcon from "@mui/icons-material/Explore";
import GroupsIcon from "@mui/icons-material/Groups";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import Home from "../../sceens/home";
import Justice from "../../sceens/justice";
import Manage from "../../sceens/manage";
import Sparta from "../../sceens/sparta";
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SuperAdmin from "../../sceens/super-admin";
import { ENV } from "../consts";

interface Page {
  name: string;
  label: string;
  path: string;
  element: JSX.Element;
  icon?: JSX.Element;
}

export const pages: Page[] = [
  {
    name: "team",
    label: "משמרות",
    path: "/",
    element: <Home />,
    icon: <PendingActionsIcon />,
  },
  // {
  //   name: "justice",
  //   label: "טבלת צדק",
  //   path: "/justice",
  //   element: <Justice />,
  //   icon: <BalanceIcon />,
  // },
  {
    name: "sparta",
    label: 'תצוגת חמ"ל',
    path: "sparta",
    element: <Sparta />,
    icon: <ExploreIcon />,
  },
  {
    name: "manage",
    label: "ניהול",
    path: "/manage",
    element: <Manage />,
    icon: <GroupsIcon />,
  },
  ...(import.meta.env.VITE_ENV !== ENV.PRODUCTION ? [
    {
      name: "admin",
      label: "סופר ניהול",
      path: "/admin",
      element: <SuperAdmin />,
      icon: <AdminPanelSettingsIcon />,
    }
  ] : []),
  {
    name: "chat",
    label: "צור קשר",
    path: import.meta.env.VITE_CHAT_URL,
    element: <></>,
    icon: <PhonelinkSetupIcon />,
  },
];
