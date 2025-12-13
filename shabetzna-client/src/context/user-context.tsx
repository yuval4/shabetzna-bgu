import { createContext, useEffect, useState } from "react";
import { getUser } from "../queries/users";
import { getFromLocalStorage, removeFromLocalStorage, USER_TOKEN_KEY } from "../shared/local-storage";
import { User } from "../shared/types/entities/user";
import OneSignal from 'react-onesignal';
import { useTrack } from "../hooks/use-track";
interface UserState {
  user: User | undefined;
  login: (user: User) => void;
  logout: () => void;
  checkUser: () => void;
}

export const UserContext = createContext<UserState>({
  user: undefined as unknown as User,
  login: () => false,
  logout: () => { },
  checkUser: () => { },
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { identifyUser, resetUser } = useTrack();
  const [user, setUser] = useState<User | undefined>(undefined);
  const userToken = getFromLocalStorage(USER_TOKEN_KEY);
  const { data, refetch } = getUser({
    enabled: !userToken,
    retry: false,
    refetchOnMount: false,
  });

  const checkUser = async () => {
    const userToken2 = getFromLocalStorage(USER_TOKEN_KEY);

    if (userToken2) {
      const { data: updatedUser } = await refetch();

      if (updatedUser) {
        login(updatedUser)
      };
    }
  };

  useEffect(() => {
    checkUser();
  }, [userToken, refetch, data]);

  const login = (userData: User) => {
    identifyUser(userData);
    setUser(userData);
    OneSignal.login(userData.id);
    OneSignal.User.addTags({
      id: userData.id,
      username: userData.username,
      isTeamLeader: userData.teams.some((team) => team.role === "TEAM_LEADER").toString(),
      isTeamMember: userData.teams.some((team) => team.role === "TEAM_LEADER").toString(),
      teams: userData.teams.map((team) => team.team.name).toString(),
    })
  };

  const logout = () => {
    resetUser();
    setUser(undefined);
    removeFromLocalStorage(USER_TOKEN_KEY);
    OneSignal.logout();
  };

  return (
    <UserContext.Provider value={{ user, login, logout, checkUser }}>
      {children}
    </UserContext.Provider>
  );
};
