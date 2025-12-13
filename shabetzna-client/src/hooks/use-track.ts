import { usePostHog } from "posthog-js/react";
import { User } from "../shared/types/entities/user";
import { Unit } from "../shared/types/entities/unit";
import { Team } from "../shared/types/entities/team";

const events = {
  auth: {
    google: "login_with_google",
    local: "login_with_local",
    logout: "logout",
  },
  error: {
    exit_error_click: "exit_error_click",
  },
  layout: {
    navigate: "navigate",
    open_menu: "open_menu",
    team_switch: "team_switch",
  },
  constraints: {
    filter: "constraints_filter",
    create: "constraints_create",
    updated: "constraints_updated",
    delete: "constraints_delete",
    open_create_modal: "open_create_constraint_modal",
    close_create_modal: "close_create_constraint_modal",
    approve: "constraints_approved",
    reject: "constraints_rejected",
    open_edit_modal: "open_edit_constraint_modal",
    close_edit_modal: "close_edit_constraint_modal",
    open_menu: "open_constraint_menu",
  },
  shifts: {
    create: "shifts_create",
    updated: "shifts_updated",
    delete: "shifts_delete",
    export: "shifts_export_to_excel",
    open_create_modal: "open_create_shift_modal",
    open_edit_modal: "open_edit_shifts_modal",
    add_shift_in_edit_modal: "add_shift_in_edit_modal",
    close_modal_with_unsaved_changes:
      "close_edit_shifts_modal_with_unsaved_changes",
    save_changes: "save_changes_in_edit_shifts_modal",
  },
  users: {
    avatar_clicked: "avatar_clicked",
  },
  teams: {
    create: "teams_create",
    updated: "teams_updated",
    delete: "teams_delete",
    add_user: "add_user_to_team",
    remove_user: "remove_user_from_team",
  },
  units: {
    create: "units_create",
    updated: "units_updated",
    delete: "units_delete",
  },
  easter_eggs: {
    nofiki_song: "toggle_nofiki_song",
  },
} as const;

type EventCategory = keyof typeof events;
type EventName<T extends EventCategory> = keyof (typeof events)[T];

export const useTrack = () => {
  const posthog = usePostHog();

  if (!posthog) {
    return {
      trackEvent: () => {},
      identifyUser: () => {},
      resetUser: () => {},
      trackUnit: () => {},
      trackTeam: () => {},
      registerProperty: () => {},
    };
  }

  const trackEvent = <T extends EventCategory>(
    category: T,
    event: EventName<T>,
    properties?: Record<string, unknown>
  ) => {
    const eventValue = events[category][event];
    posthog.capture(eventValue as string, { category, ...properties });
  };

  const identifyUser = (
    user: Pick<User, "id" | "username" | "email" | "phone">
  ) => {
    posthog.identify(user.id, {
      username: user.username,
      email: user.email,
      phone: user.phone,
    });
  };

  const trackUnit = (unit: Pick<Unit, "id"> & Partial<Unit>) => {
    posthog.group("unit", unit.id, { name: unit.name });
  };

  const trackTeam = (team: Team) => {
    posthog.group("team", team.id, {
      name: team.name,
    });
  };

  const resetUser = () => {
    posthog.reset();
  };

  const registerProperty = (
    properties: Record<string, unknown>,
    expires?: number
  ) => {
    posthog.register(properties, expires);
  };

  return {
    trackEvent,
    identifyUser,
    resetUser,
    trackUnit,
    trackTeam,
    registerProperty,
  };
};
