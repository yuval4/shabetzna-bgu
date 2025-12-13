import { createContext, useContext, useEffect, useState } from "react";
import { Role } from "../shared/enums/roles";
import { Team } from "../shared/types/entities/team";
import { UserContext } from "./user-context";

interface TeamState {
  selectedTeam: Team;
  role: Role;
  setSelectedTeam: (team: Team) => void;
}

export const TeamContext = createContext<TeamState>({
  selectedTeam: null as unknown as Team,
  role: null as unknown as Role,
  setSelectedTeam: () => null,
});

export const TeamProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTeam, setSelectedTeam] = useState({} as unknown as Team);
  const [selectedTeamRole, setSelectedTeamRole] = useState<Role>("TEAM_LEADER");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setSelectedTeam(user?.teams[0].team);
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedTeam && user?.teams) {
      const selectedTeamRole = user?.teams.find((team) => team.team.id === selectedTeam.id)?.role;
      selectedTeamRole && setSelectedTeamRole(selectedTeamRole);
    }
  }, [selectedTeam]);


  return (
    <TeamContext.Provider value={{ selectedTeam, role: selectedTeamRole, setSelectedTeam }}>
      {children}
    </TeamContext.Provider>
  );
};
